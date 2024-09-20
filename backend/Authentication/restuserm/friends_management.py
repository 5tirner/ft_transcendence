from django.db.models.query import Q
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import Response, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .serializers import PlayerSerializerInfoSmall


from restuserm.friends_serializers import (
    FriendshipSerializer,
    PlayerSerializerInformation,
)
from restuserm.models import Player, Friendships
from restuserm.services import jwt_required_cookie


@authentication_classes([])  # Remove all authentication classes
@permission_classes([AllowAny])
class ListAllUsersView(ListAPIView):
    serializer_class = PlayerSerializerInformation
    # queryset = Player.objects.all()

    @method_decorator(jwt_required_cookie)
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        current_user_id = self.request.decoded_token.get("id")

        # Get the Player object for the current user
        current_player = Player.objects.get(id=current_user_id)

        # Get all the friends and blocked users for the current user
        excluded_players = Friendships.objects.filter(
            (Q(sender=current_player) | Q(receiver=current_player)),
            status__in=[
                Friendships.Status.ACCEPTED.value,
                Friendships.Status.BLOCKED.value,
                Friendships.Status.PENDING.value,
            ],
        ).values_list("sender_id", "receiver_id", flat=False)

        excluded_user_ids = {current_user_id}  # Exclude the current user as well

        # Add all related user IDs to the exclusion list
        for sender_id, receiver_id in excluded_players:
            excluded_user_ids.add(sender_id)
            excluded_user_ids.add(receiver_id)

        # Exclude the current user and their friends or blocked users from the queryset
        return Player.objects.exclude(id__in=excluded_user_ids)


@authentication_classes([])  # Remove all authentication classes
@permission_classes([AllowAny])
class BlockUserView(CreateAPIView):
    serializer_class = FriendshipSerializer

    @method_decorator(jwt_required_cookie)
    def create(self, request, *args, **kwargs):
        sender = self.request.decoded_token.get("id")
        user_id = request.data.get("id_target")
        receiver = get_object_or_404(Player, id=user_id)

        existing_friendship = Friendships.objects.filter(
            (
                (Q(sender=sender) & Q(receiver=receiver))
                | (Q(sender=receiver) & Q(receiver=sender))
            ),
            status__in=[
                Friendships.Status.PENDING.value,
                Friendships.Status.ACCEPTED.value,
            ],
        ).first()

        if existing_friendship:
            existing_friendship.delete()

        receiver = Player.objects.get(id=user_id)
        sender = Player.objects.get(id=sender)
        new_friendship = Friendships.objects.create(
            sender=sender, receiver=receiver, status=Friendships.Status.BLOCKED.value
        )

        serializer = self.get_serializer(new_friendship)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @method_decorator(jwt_required_cookie)
    def delete(self, request, *args, **kwargs):
        sender_id = self.request.decoded_token.get("id")
        user_id = request.data.get("id_target")
        receiver = get_object_or_404(Player, id=user_id)

        # Check for the friendship where the current user is either the sender or receiver and the status is BLOCKED
        existing_friendship = Friendships.objects.filter(
            sender=sender_id,
            receiver=receiver,
            status=Friendships.Status.BLOCKED.value,
        ).first()

        if existing_friendship:
            existing_friendship.delete()
            return Response(
                {"message": "Block removed successfully"},
                status=status.HTTP_204_NO_CONTENT,
            )

        return Response(
            {"error": "No blocked friendship found"}, status=status.HTTP_404_NOT_FOUND
        )


class CheckBlockView(APIView):
    permission_classes = [AllowAny]  # No authentication required

    @method_decorator(jwt_required_cookie)
    def post(self, request, *args, **kwargs):
        user_a_id = request.data.get("user_a_id")
        user_b_id = request.data.get("user_b_id")

        if not user_a_id or not user_b_id:
            return Response(
                {"detail": "Both user_a_id and user_b_id are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if user A has blocked user B
        if self.is_blocked(user_a_id, user_b_id):
            return Response(
                {
                    "blocked": True,
                    "detail": f"User {user_a_id} has blocked User {user_b_id}",
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "blocked": False,
                "detail": f"User {user_a_id} has not blocked User {user_b_id}",
            },
            status=status.HTTP_200_OK,
        )

    def is_blocked(self, user_a_id, user_b_id):
        """Check if user A has blocked user B using the Friendship model."""
        return Friendships.objects.filter(
            sender_id=user_a_id,
            receiver_id=user_b_id,
            status=Friendships.Status.BLOCKED.value,
        ).exists()


@authentication_classes([])  # Remove all authentication classes
@permission_classes([AllowAny])
class UserView(APIView):

    @method_decorator(jwt_required_cookie)
    def get(self, request, pk=None):
        try:
            # Get the player based on the primary key from the URL
            player = Player.objects.get(pk=pk)
            serializer = PlayerSerializerInfoSmall(player)
            return Response(
                {
                    "player": serializer.data,
                    "message": "User has been found successfully",
                    "status": 200,
                }
            )
        except Player.DoesNotExist:
            return Response({"message": "User not found", "status": 404})

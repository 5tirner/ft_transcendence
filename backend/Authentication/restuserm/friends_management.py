from django.db.models.query import Q
from django.utils.decorators import method_decorator
from rest_framework.generics import ListAPIView
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny


from restuserm.friends_serializers import PlayerSerializerInformation
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
            ],
        ).values_list("sender_id", "receiver_id", flat=False)

        excluded_user_ids = {current_user_id}  # Exclude the current user as well

        # Add all related user IDs to the exclusion list
        for sender_id, receiver_id in excluded_players:
            excluded_user_ids.add(sender_id)
            excluded_user_ids.add(receiver_id)

        # Exclude the current user and their friends or blocked users from the queryset
        return Player.objects.exclude(id__in=excluded_user_ids)

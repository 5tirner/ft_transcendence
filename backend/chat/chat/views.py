from rest_framework.mixins import status
from rest_framework.response import Response
from rest_framework.generics import (
    DestroyAPIView,
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    get_object_or_404,
)

# from restuserm.models import Player, Friendships

from .serializers import (
    ConversationsSerializer,
    MessageSerializer,
    ChatRoomSerializer,
    SubmitMessageSerializer,
)
from .models import ChatRoom, Message
from django.db.models.functions import Coalesce
from django.db.models import Q, Max, F


# Create your views here.
class GetAllConversations(ListAPIView):
    serializer_class = ConversationsSerializer

    def get_queryset(self):
        user_id = self.request.user.id
        return (
            ChatRoom.objects.filter(Q(user_a_id=user_id) | Q(user_b_id=user_id))
            .annotate(
                last_message_timestamp=Coalesce(
                    Max("messages__timestamp"), F("created_at")
                )
            )
            .order_by("-last_message_timestamp")
        )


class GetRoomMessages(ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        room_id = self.kwargs["pk"]
        return Message.objects.filter(chatroom=room_id).order_by("timestamp")


#
#
class CreateConversation(CreateAPIView):
    serializer_class = ChatRoomSerializer

    def perform_create(self, serializer):
        serializer.save(user_a=self.request.user)


from core.auth_middleware import CustomUser
from rest_framework.exceptions import AuthenticationFailed


# class SubmitMessage(CreateAPIView):
#     serializer_class = SubmitMessageSerializer
#
#     def perform_create(self, serializer):
#         user = self.request.user
#         if not isinstance(user, CustomUser):
#             raise AuthenticationFailed("User is not authenticated properly.")
#         serializer.save(sender_id=user.id)
#
#     def create(self, request, *args, **kwargs):
#         if not request.user.is_authenticated:
#             return Response(
#                 {"detail": "Authentication credentials were not provided."},
#                 status=status.HTTP_401_UNAUTHORIZED,
#             )
#
#         # Use the base class's create method
#         return super().create(request, *args, **kwargs)


class SubmitMessage(CreateAPIView):
    serializer_class = SubmitMessageSerializer

    def perform_create(self, serializer):
        serializer.save(sender_id=self.request.user.id)


class RoomMessagesReaded(RetrieveAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer

    def retrieve(self, request, *args, **kwargs):
        chat_room = self.get_object()
        chat_room.messages.exclude(sender_id=request.user.id).update(readed=True)
        return Response(
            {"detail": "All messages marked as read."}, status=status.HTTP_200_OK
        )


class DeleteConversation(DestroyAPIView):
    def get_object(self):
        user_a = self.request.user.id
        user_id = self.kwargs["user_id"]

        # user_b = get_object_or_404(Player, id=user_id)

        chat_room = get_object_or_404(
            ChatRoom,
            Q(user_a_id=user_a, user_b_id=user_id)
            | Q(user_a_id=user_id, user_b_id=user_a),
        )

        return chat_room

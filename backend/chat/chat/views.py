import requests
from rest_framework.mixins import status
from rest_framework.response import Response
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    UpdateAPIView,
)

from .serializers import (
    ConversationsSerializer,
    MessageSerializer,
    ChatRoomSerializer,
    SubmitMessageSerializer,
)
from .models import ChatRoom, Message
from chat import serializers
from django.db.models.functions import Coalesce
from django.db.models import Q, Max, F


# Create your views here.
class GetAllConversations(ListAPIView):
    serializer_class = ConversationsSerializer

    # TODO: understan what is going on here in query
    def get_queryset(self):
        user = self.request.user
        return (
            ChatRoom.objects.filter(Q(user_a=user.id) | Q(user_b=user.id))
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


class CreateConversation(CreateAPIView):
    serializer_class = ChatRoomSerializer

    def perform_create(self, serializer):
        serializer.save(user_a=self.request.user)


class SubmitMessage(CreateAPIView):
    serializer_class = SubmitMessageSerializer


class RoomMessagesReaded(RetrieveAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer

    def retrieve(self, request, *args, **kwargs):
        chat_room = self.get_object()
        chat_room.messages.exclude(sender=request.user).update(readed=True)
        return Response(
            {"detail": "All messages marked as read."}, status=status.HTTP_200_OK
        )

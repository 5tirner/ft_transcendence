import requests
from rest_framework.mixins import status
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView

from .serializers import (
    ConversationsSerializer,
    MessageSerializer,
    ChatRoomSerializer,
    SubmitMessageSerializer,
)
from .models import ChatRoom, Message
from chat import serializers
from django.db.models import Q


# Create your views here.
class GetAllConversations(ListAPIView):
    serializer_class = ConversationsSerializer

    def get_queryset(self):
        user = self.request.user
        return ChatRoom.objects.filter(Q(user_a=user.id) | Q(user_b=user.id))


class GetRoomMessages(ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        room_id = self.kwargs["pk"]
        return Message.objects.filter(chatroom=room_id)


class CreateConversation(CreateAPIView):
    serializer_class = ChatRoomSerializer

    def perform_create(self, serializer):
        serializer.save(user_a=self.request.user)


class SubmitMessage(CreateAPIView):
    serializer_class = SubmitMessageSerializer

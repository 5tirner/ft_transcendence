import requests
from rest_framework.mixins import status
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView

from .serializers import ConversationsSerializer, MessageSerializer, ChatRoomSerializer
from .models import ChatRoom, Message
from chat import serializers


# Create your views here.
class GetAllConversations(ListAPIView):
    serializer_class = ConversationsSerializer

    def get_queryset(self):
        user = self.request.user
        return ChatRoom.objects.filter(members=user.id)


class GetRoomMessages(ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        room_id = self.kwargs["pk"]
        return Message.objects.filter(chatroom=room_id)


class CreateConversation(CreateAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer

    def perform_create(self, serializer):
        try:
            chatroom = serializer.save()
            chatroom.members.add(self.request.user)
        except serializers.ValidationError as e:
            existing_chatroom = e.detail.get("chatroom")
            if existing_chatroom:
                self.existing_instance = existing_chatroom
                return
            raise e

    def create(self, request, *args, **kwargs):
        self.existing_instance = None
        response = super().create(request, *args, **kwargs)
        if self.existing_instance:
            return Response(
                ChatRoomSerializer(self.existing_instance).data,
                status=status.HTTP_200_OK,
            )
        return response

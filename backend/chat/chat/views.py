from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView

from .serializers import ConversationsSerializer, MessageSerializer
from .models import ChatRoom, Message


# Create your views here.
class GetAllConversations(ListAPIView):
    serializer_class = ConversationsSerializer

    def get_queryset(self):
        user = self.request.user
        return ChatRoom.objects.filter(members=user)


class GetRoomMessages(ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        room_id = self.kwargs["pk"]
        return Message.objects.filter(chatroom=room_id)

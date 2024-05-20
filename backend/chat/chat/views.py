from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView

from .serializers import ConversationsSerializer, MessageSerializer
from .models import ChatRoom, Message
from rest_framework.permissions import AllowAny


# Create your views here.
class GetAllConversations(ListAPIView):
    serializer_class = ConversationsSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # NOTE: set a user hard code
        user = 1
        # print(self.request)
        print("cookies ===> ")
        for cookie, value in self.request.COOKIES.items():
            print(f"{cookie}: {value}")

        print("HEADERS ===> ")
        for cookie, value in self.request.headers.items():
            print(f"{cookie}: {value}")
        return ChatRoom.objects.filter(members=user)


class GetRoomMessages(ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        room_id = self.kwargs["pk"]
        return Message.objects.filter(chatroom=room_id)

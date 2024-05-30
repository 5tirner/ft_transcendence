import requests
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView

from .serializers import ConversationsSerializer, MessageSerializer
from .models import ChatRoom, Message
from restuserm.models import Player
from rest_framework.permissions import AllowAny


# Create your views here.
class GetAllConversations(ListAPIView):
    serializer_class = ConversationsSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # NOTE: set a user hard code

        url = "http://auth:8000/api/usercheck/"
        token = self.request.COOKIES.get("jwt_token", None)

        if not token:
            return ChatRoom.objects.none()

        cookie = {"jwt_token": token}
        resp = requests.get(url, cookies=cookie)
        if resp.status_code != 200:
            return ChatRoom.objects.none()
        try:
            resp_data = resp.json()
        except:
            return ChatRoom.objects.none()
        user_data = resp_data.get("data", {})
        user_id = user_data.get("id", None)
        if not user_id:
            return ChatRoom.objects.none()
        us = Player.objects.filter(pk=user_id)
        print(us)
        # print("cookies ===> ")
        # for cookie, value in self.request.COOKIES.items():
        #     print(f"{cookie}: {value}")
        # print("token jwt", self.request.decoded_token)
        return ChatRoom.objects.filter(members=user_id)


class GetRoomMessages(ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        room_id = self.kwargs["pk"]
        return Message.objects.filter(chatroom=room_id)

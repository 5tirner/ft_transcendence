from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.conf import settings
import httpx


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("============= consumer  in ====================")
        print(self.scope["user_id"], self.scope["user"])
        print("============= consumer out ====================")
        self.room_name = "test"  # self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_test"  # chat_{self.room_name}"

        # Join room group
        await self.channel_layer.group_add(self.scope["user"], self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        # submit message endpoint
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        user = text_data_json["user"]
        room_id = text_data_json["room_id"]

        # Send message to room group along with user info
        await self.channel_layer.group_send(
            user,
            {
                "type": "chat.message",
                "message": message,
                "user": self.scope["user"],
            },
        )
        # send message to message sender
        await self.channel_layer.group_send(
            self.scope["user"],
            {
                "type": "chat.own.message",
                "message": message,
            },
        )
        await self.submit_message(message, room_id)

    async def submit_message(self, msg, room_id):
        SM_URL = settings.CHAT_URI + "create/msg/"
        print(room_id)
        data = {"chatroom": room_id, "sender": self.scope["user_id"], "content": msg}
        # chatroom sender and message conent
        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(SM_URL, cookies=self.scope["cookie"], json=data)
        except Exception as e:
            pass

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        user = event["user"]

        # Send message to WebSocket along with user info
        await self.send(
            text_data=json.dumps(
                {"message": message, "user": user, "sent": False, "recv": True}
            )
        )

    async def chat_own_message(self, event):
        message = event["message"]

        # Send message to WebSocket along with user info
        await self.send(
            text_data=json.dumps({"message": message, "sent": True, "recv": False})
        )

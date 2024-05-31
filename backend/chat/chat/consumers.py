from channels.generic.websocket import AsyncWebsocketConsumer
import json


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("============= consumer  in ====================")
        print(self.scope)
        print("============= consumer out ====================")
        self.room_name = "test"  # self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_testf"  # chat_{self.room_name}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        print(message)

        # Send message to room group along with user info
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                # "type": "chat.message",
                "message": message,
                # "user": self.scope["user"].username,
            },
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        user = event["user"]

        # Send message to WebSocket along with user info
        await self.send(text_data=json.dumps({"message": message, "user": user}))

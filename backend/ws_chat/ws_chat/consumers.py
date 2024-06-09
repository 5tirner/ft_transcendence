from channels.generic.websocket import AsyncWebsocketConsumer
import json


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
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        user = text_data_json["user"]
        print(message)
        print(self.scope)
        # Send message to room group along with user info
        await self.channel_layer.group_send(
            # self.room_group_name,
            user,
            {
                "type": "chat.message",
                "message": message,
                "user": self.scope["user"],
            },
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        user = event["user"]

        # Send message to WebSocket along with user info
        await self.send(text_data=json.dumps({"message": message, "user": user}))

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.conf import settings
import httpx


class ChatConsumer(AsyncJsonWebsocketConsumer):
    GLOBAL_CHANEL = "online"

    async def connect(self):
        # Join channel group
        await self.channel_layer.group_add(self.GLOBAL_CHANEL, self.channel_name)
        await self.channel_layer.group_add(
            str(self.scope["user_id"]), self.channel_name
        )

        await self.update_player_status("ON", True)
        await self.accept()

    async def disconnect(self, close_code):

        await self.update_player_status("OFF", False)
        await self.channel_layer.group_discard(
            str(self.scope["user_id"]), self.channel_name
        )

    async def update_player_status(self, status, online_status):
        async with httpx.AsyncClient() as client:
            await client.post(
                "http://auth:8000/api/",
                cookies=self.scope["cookie"],
                json={"player": {"status": status}},
            )
        await self.channel_layer.group_send(
            self.GLOBAL_CHANEL,
            {
                "type": "chat.status",
                "online": online_status,
                "user": self.scope["user"],
            },
        )

    async def receive_json(self, content):
        try:
            type = content["type"]
            if type == "chat":
                message = content["message"]
                user = content["user"]
                room_id = content["room_id"]
                user_id = content["user_id"]

                # submit message to database
                await self.submit_message(message, room_id)
                # send message to the specified user channel
                await self.send_message_to_user(user_id, message, False)
                # send message to message sender
                await self.send_message_to_user(user_id, message, True)
            elif type == "status":
                pass
            elif type == "friendship":
                await self.send_friendship_update(content)
                # await self.send_friendship_update()
        except Exception as e:
            pass

    async def send_friendship_update(self, content):
        print(content)
        user = content["user_id"]
        event = content["event"]
        await self.channel_layer.group_send(
            str(user),
            {
                "type": "friendship.update",
                "event": event,
            },
        )

    async def friendship_update(self, event):
        data = {"event": event["event"], "friendship_type": True}
        await self.send_json(data)

    async def send_message_to_user(self, user_id, message, is_user):
        if not is_user:
            channel = str(user_id)
        else:
            channel = str(self.scope["user_id"])
        await self.channel_layer.group_send(
            channel,
            {
                "type": "chat.message",
                "message": message,
                "user": self.scope["user"],
                "id": self.scope["user_id"],
                "user_msg": is_user,
            },
        )

    async def submit_message(self, msg, room_id):
        # submit message API
        SM_URL = settings.CHAT_URI + "create/msg/"
        data = {"chatroom": room_id, "sender": self.scope["user_id"], "content": msg}
        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(SM_URL, cookies=self.scope["cookie"], json=data)
        except Exception as e:
            pass

    # Receive message from room group
    async def chat_message(self, event):
        data = {
            "id": event["id"],
            "message": event["message"],
            "user": event["user"],
            "sent": event["user_msg"],
            "msg_type": True,
        }
        # Send message to WebSocket along with user info
        await self.send_json(data)

    async def chat_status(self, event):
        data = {"online": event["online"], "user": event["user"], "status_type": True}
        await self.send_json(data)

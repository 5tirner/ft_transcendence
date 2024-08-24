from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.conf import settings
import httpx
import string
import random


dupUsers = {}


class ChatConsumer(AsyncJsonWebsocketConsumer):
    GLOBAL_CHANEL = "online"

    async def connect(self):
        # Join channel group
        await self.channel_layer.group_add(self.GLOBAL_CHANEL, self.channel_name)
        await self.channel_layer.group_add(
            str(self.scope["user_id"]), self.channel_name
        )

        if self.scope["user_id"] not in dupUsers:
            dupUsers[self.scope["user_id"]] = 1
        else:
            dupUsers[self.scope["user_id"]] += 1

        await self.update_player_status("ON", True)
        await self.accept()

    async def disconnect(self, close_code):

        dupUsers[self.scope["user_id"]] -= 1
        if dupUsers[self.scope["user_id"]] == 0:
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

    def generate_room_code(self):
        return self.scope["user"] + "".join(
            random.choices(
                string.ascii_uppercase + string.ascii_lowercase + string.digits, k=10
            )
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
        except Exception as e:
            pass

    async def send_friendship_update(self, content):
        # print(content)
        user = content["user_id"]
        event = content["event"]
        generated_code = self.generate_room_code()
        if event == "block_u" or event == "block_f":
            async with httpx.AsyncClient() as client:
                await client.delete(
                    f"http://chat:8000/api/chat/delete/{user}/",
                    cookies=self.scope["cookie"],
                )
        if event == "acc_game":
            print("accepted game", user, self.scope["user_id"])
            data = {
                "type": "friendship.update",
                "event": "acc_game",
                "room_code": generated_code,
            }
            await self.channel_layer.group_send(
                str(user),
                data,
            )
            await self.channel_layer.group_send(
                str(self.scope["user_id"]),
                data,
            )
        else:
            await self.channel_layer.group_send(
                str(user),
                {
                    "sender_id": self.scope["user_id"],
                    "type": "friendship.update",
                    "event": event,
                    "user_id": user,
                    "username": content["user"],
                    "avatar": content["avatar"],
                },
            )

    async def friendship_update(self, event):
        event["friendship_type"] = True
        await self.send_json(event)

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

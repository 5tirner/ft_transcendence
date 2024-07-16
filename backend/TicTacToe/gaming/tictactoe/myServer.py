from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import onLobby
from threading import Thread

def removeUserFromLobby(login):
    try:
        userinLobby = onLobby.objects.get(login=login)
        userinLobby.delete()
        print("User Out Of Lobby")
    except:
        print("Already Out Of Lobby")
class myServerOnLobby(AsyncWebsocketConsumer):
    async def connect(self):
        print(f'----------User On Lobby Is: {self.scope["user"]}-------')
        await self.accept()
    async def receive(self, text_data, bytes_data=0):
        print(f'----------Data Come From User: {self.scope["user"]}-------')
        print(f"Data: {text_data}")
        await self.send(self.scope["user"])
        print("DONE!")
    async def disconnect(self, code):
        print(f"Connection Of User: {self.scope['user']} Lost")
        removeUser = Thread(target=removeUserFromLobby, args=(self.scope['user'], ))
        await self.close()
        removeUser.start()
        removeUser.join()
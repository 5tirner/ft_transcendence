from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import onLobby, gameInfo
from threading import Thread
import os
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

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
        try:
            userinLobby = onLobby.objects.get(login=self.scope['user'])
            userinLobby.delete()
            print("User Out Of Lobby")
        except:
            print("Already Out Of Lobby")
        await self.close()

class myServerOnGame(AsyncWebsocketConsumer):
    playerWantsToPlay = list()
    async def connect(self):
        print(f'----------User On GAME Is: {self.scope["user"]}-------')
        if len(self.playerWantsToPlay) == 0:
            player1, player2 = self.scope['user'], ""
            roomid = gameInfo.objects.get(login=self.scope["user"]).codeToPlay
            self.playerWantsToPlay.append(self.scope['user'])
            print(f"{self.scope['user']} Alone In The Q, He Waiting")
            await self.channel_layer.group_add(roomid, self.channel_name)
        else:
            player1, player2 = self.playerWantsToPlay[0], self.scope['user']
            print(f"{self.scope['user']} Will Joinned To The Player {self.playerWantsToPlay[0]}")
            roomid = gameInfo.objects.get(login=self.playerWantsToPlay[0]).codeToPlay
            await self.channel_layer.group_add(roomid, self.channel_name)
            self.playerWantsToPlay.remove(self.playerWantsToPlay[0])
            print(f"Still In Q: {len(self.playerWantsToPlay)}")
        await self.accept()
        toFronEnd = json.dumps({'player1': player1, 'player2': player2, 'roomid': roomid})
        print(f"Player1: {player1}, Player2: {player2}, RoomId: {roomid}")
        await self.channel_layer.group_send(roomid, {'type': 'ToFront', 'Data': toFronEnd})
    async def receive(self, text_data, bytes_data=0):
        print(f'----------Data Come From User: {self.scope["user"]}-------')
        print(f"Data: {text_data}")
        print("DONE!")
    async def disconnect(self, code):
        print(f"Connection Of User: {self.scope['user']} Lost")
        self.channel_layer.group_discard(roomid, self.channel_name)
    
    async def ToFront(self, data):
        print("Sending Data To Clinet...")
        await self.send(data['Data'])
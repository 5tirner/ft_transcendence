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
    playersOnMatchAndItsRoomId = dict()
    playersOnMatchAndItsOppenent = dict()
    async def connect(self):
        print(f'----------User On GAME Is: {self.scope["user"]}-------')
        if len(self.playerWantsToPlay) == 0:
            player1, player2 = self.scope['user'], ""
            if self.playersOnMatchAndItsRoomId.get(player1) is not None:
                print(f"Can't Add Player {player1} To Q His Alraedy In Match")
                await self.close()
            else:
                roomid = gameInfo.objects.get(login=self.scope["user"]).codeToPlay
                self.playerWantsToPlay.append(self.scope['user'])
                print(f"{self.scope['user']} Alone In The Q, He Waiting")
                await self.channel_layer.group_add(roomid, self.channel_name)
                await self.accept()
                toFronEnd = json.dumps({'player1': player1, 'player2': player2, 'roomid': roomid})
                print(f"Player1: {player1}, Player2: {player2}, RoomId: {roomid}")
                await self.channel_layer.group_send(roomid, {'type': 'ToFrontOnConnect', 'Data': toFronEnd})
        else:
            player1, player2 = self.playerWantsToPlay[0], self.scope['user']
            if self.playersOnMatchAndItsRoomId.get(player2) is not None:
                print(f"Can't Add Player {player2} To Game With {player1} His Alraedy In Match")
                await self.close()
            else:
                print(f"{self.scope['user']} Will Joinned To The Player {self.playerWantsToPlay[0]}")
                roomid = gameInfo.objects.get(login=self.playerWantsToPlay[0]).codeToPlay
                self.playersOnMatchAndItsOppenent[player1] = player2
                self.playersOnMatchAndItsOppenent[player2] = player1
                self.playersOnMatchAndItsRoomId[player1] = roomid
                self.playersOnMatchAndItsRoomId[player2] = roomid
                await self.channel_layer.group_add(roomid, self.channel_name)
                self.playerWantsToPlay.remove(self.playerWantsToPlay[0])
                await self.accept()
                toFrontEnd = json.dumps({'player1': player1, 'player2': player2, 'roomid': roomid})
                print(f"Player1: {player1}, Player2: {player2}, RoomId: {roomid}")
                await self.channel_layer.group_send(roomid, {'type': 'ToFrontOnConnect', 'Data': toFrontEnd})
            print(f"Still In Q: {len(self.playerWantsToPlay)}")
    async def receive(self, text_data, bytes_data=0):
        print(f'----------Data Come From User: {self.scope["user"]}-------')
        print(f"Data From Type: {type(text_data)} ==> {text_data}")
        print("DONE!")
        thisUser, hisOppenent = self.scope["user"], self.playersOnMatchAndItsOppenent.get(self.scope["user"])
        roomidForThisUser = self.playersOnMatchAndItsRoomId.get(thisUser)
        print(f"Id To Send Data: {roomidForThisUser}")
        toFrontEnd = json.dumps({'etat': "PLAYING", 'user': thisUser, 'oppenent': hisOppenent})
        if roomidForThisUser is not None:
            await self.channel_layer.group_send(roomidForThisUser, {'type': 'ToFrontOnPlaying', 'Data': toFrontEnd})
    async def disconnect(self, code):
        print(f"Connection Of User: {self.scope['user']} Lost")
        try:
            roomidForThisUser = self.playersOnMatchAndItsRoomId.get(self.scope["user"])
            player1, player2 = self.scope['user'], self.playersOnMatchAndItsOppenent.get(self.scope['user'])
            self.playersOnMatchAndItsOppenent.pop(player1)
            self.playersOnMatchAndItsOppenent.pop(player2)
            self.playersOnMatchAndItsRoomId.pop(player1)
            self.playersOnMatchAndItsRoomId.pop(player2)
            await self.channel_layer.group_discard(roomidForThisUser, self.channel_name)
        except:
            pass
    
    async def ToFrontOnConnect(self, data):
        print("Sending Data To Clinet...")
        await self.send(data['Data'])
    
    async def ToFrontOnPlaying(self, data):
        print("Sending Data To Clinet...")
        await self.send(data['Data'])
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import pongGameInfo, pongHistory
import json
import os
from .destroyGameInfo import destroyThisGameInformations
from .generateCode import roomcode

os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

class myPongserver(AsyncWebsocketConsumer):
    playerWantsToPlay = list()
    playersOnMatchAndItsRoomId = dict()
    playersOnMatchAndItsOppenent = dict()
    playersOnMatchAndItsDeriction = dict()
    async def connect(self):
        print(f'----------User On Game Is: {self.scope["user"]}-------')
        try:
            print(f"Welcome Back {self.scope['user']}.")
            pongGameInfo.objects.get(login=self.scope['user'])
        except:
            print(f"It's Your First Time Here {self.scope['user']}! Welcome.")
            addUserToDB = pongGameInfo(login=self.scope['user'], codeToPlay=roomcode(self.scope['user']))
            addUserToDB.save()
            print(f"{self.scope['user']} Added Succusfully")
        if len(self.playerWantsToPlay) == 0:
            player1, player2 = self.scope['user'], ""
            print("Vide Q")
            if self.playersOnMatchAndItsRoomId.get(player1) is not None:
                print(f"Can't Add Player {player1} To Q His Alraedy In Match")
                await self.close()
            else:
                roomid = pongGameInfo.objects.get(login=self.scope["user"]).codeToPlay
                self.playerWantsToPlay.append(self.scope['user'])
                print(f"{self.scope['user']} Alone In The Q, He Waiting")
                await self.channel_layer.group_add(roomid, self.channel_name)
                await self.accept()
                toFronEnd = json.dumps({'player1': player1, 'player2': player2, 'roomid': roomid})
                print(f"Player1: {player1}, Player2: {player2}, RoomId: {roomid}")
                await self.channel_layer.group_send(roomid, {'type': 'ToFrontOnConnect', 'Data': toFronEnd})
        else:
            player1, player2 = self.playerWantsToPlay[0], self.scope['user']
            print("Player Waiting...")
            if player1 == player2:
                print(f"{player1} Deux Fois")
                await self.close()
            elif self.playersOnMatchAndItsRoomId.get(player2) is not None:
                print(f"Can't Add Player {player2} To Game With {player1} His Alraedy In Match")
                await self.close()
            else:
                print(f"{self.scope['user']} Will Joinned To The Player {self.playerWantsToPlay[0]}")
                roomid = pongGameInfo.objects.get(login=self.playerWantsToPlay[0]).codeToPlay
                self.playersOnMatchAndItsOppenent[player1] = player2
                self.playersOnMatchAndItsOppenent[player2] = player1
                self.playersOnMatchAndItsRoomId[player1] = roomid
                self.playersOnMatchAndItsRoomId[player2] = roomid
                await self.channel_layer.group_add(roomid, self.channel_name)
                self.playerWantsToPlay.remove(self.playerWantsToPlay[0])
                await self.accept()
                user1 = pongGameInfo.objects.get(login=player1)
                user1.gamesPlayed += 1
                user1.save()
                user2 = pongGameInfo.objects.get(login=player2)
                user2.gamesPlayed += 1
                user2.save()
                toFrontEnd = json.dumps({'player1': player1, 'player2': player2, 'roomid': roomid})
                print(f"Player1: {player1}, Player2: {player2}, RoomId: {roomid}")
                await self.channel_layer.group_send(roomid, {'type': 'ToFrontOnConnect', 'Data': toFrontEnd})
            print(f"Still In Q: {len(self.playerWantsToPlay)}")

    async def receive(self, text_data, bytes_data=None):
        print(f"Data Received From Clinet {self.scope['user']}:\n{text_data}")
        thisUser = self.scope['user']
        oppenent = self.playersOnMatchAndItsOppenent.get(self.scope['user'])
        roomidForThisUser = self.playersOnMatchAndItsRoomId.get(thisUser)
        print(f"{thisUser} Move His Paddle Agianst {oppenent}")
        dataFromClient = json.loads(text_data)
        if dataFromClient.get('gameStat') == "onprogress":
            if dataFromClient.get('move') == "":
                print("Ball")
            elif dataFromClient.get('move') == "UP":
                if self.playersOnMatchAndItsRoomId.get(thisUser) == pongGameInfo.objects.get(login=thisUser).codeToPlay:
                    print(f"Paddl1 Up {dataFromClient.get('paddle1')} -> {dataFromClient.get('paddle1') - 5}")
                    toFront = json.dumps({
                        'paddle1': dataFromClient.get('paddle1') - 5,
                        'paddle2': dataFromClient.get('paddle2'),
                        'player1': thisUser,
                        'player2': oppenent,
                        })
                else:
                    print(f"Paddl2 Up {dataFromClient.get('paddle2')} -> {dataFromClient.get('paddle2') - 5}")
                    toFront = json.dumps({
                        'paddle1': dataFromClient.get('paddle1'),
                        'paddle2': dataFromClient.get('paddle2') - 5,
                        'player1': thisUser,
                        'player2': oppenent,
                        })
            elif dataFromClient.get('move') == "DOWN":
                if self.playersOnMatchAndItsRoomId.get(thisUser) == pongGameInfo.objects.get(login=thisUser).codeToPlay:
                    print(f"Paddl1 Down {dataFromClient.get('paddle1')} -> {dataFromClient.get('paddle1') + 5}")
                    toFront = json.dumps({
                        'paddle1': dataFromClient.get('paddle1') + 5,
                        'paddle2': dataFromClient.get('paddle2'),
                        'player1': thisUser,
                        'player2': oppenent,
                        })
                else:
                    print(f"Paddl2 Down {dataFromClient.get('paddle2')} -> {dataFromClient.get('paddle2') + 5}")
                    toFront = json.dumps({
                        'paddle1': dataFromClient.get('paddle1'),
                        'paddle2': dataFromClient.get('paddle2') + 5,
                        'player1': thisUser,
                        'player2': oppenent,
                    })
            await self.channel_layer.group_send(roomidForThisUser, {'type': 'ToFrontOnConnect', 'Data': toFront})
        elif dataFromClient.get('gameStat') == "closed":
            if self.playersOnMatchAndItsOppenent.get(thisUser) is not None:
                print(f"{thisUser} Will Lose The Match Cuase He Left The Game")
                roomidForThisUser = self.playersOnMatchAndItsRoomId.get(thisUser)
                leftedGame, Win = pongGameInfo.objects.get(login=thisUser), pongGameInfo.objects.get(login=oppenent)
                leftedGame.loses += 1
                leftedGame.save()
                Win.wins +=1
                Win.save()
                print(f"Add Historic Of The Match Between {thisUser} and {oppenent}")
                user1 = pongHistory(you=thisUser,oppenent=oppenent,winner=oppenent)
                user2 = pongHistory(you=oppenent,oppenent=thisUser,winner=oppenent)
                user1.save()
                user2.save()
                print(f"Try Destroy Data")
                destroyThisGameInformations(self.playersOnMatchAndItsOppenent,
                                            self.playersOnMatchAndItsRoomId, thisUser, oppenent)
                print(f"Data For {thisUser} Destroyed")
                await self.channel_layer.group_send(roomidForThisUser, {'type': 'endGame', 'Data': "EMPTY"})
            else:
                try:
                    self.playerWantsToPlay.remove(thisUser)
                    print(f"{thisUser} Left Without Playing")
                    roomId = pongGameInfo.objects.get(login=thisUser).codeToPlay
                    await self.channel_layer.group_discard(roomId, self.channel_name)
                    await self.close()
                except:
                    print(f"{thisUser} Not In The Q At All")
    async def disconnect(self, code):
        print(f"User {self.scope['user']} Lost Connection")
        try:
            roomidForThisUser = self.playersOnMatchAndItsRoomId.get(self.scope["user"])
            player1, player2 = self.scope['user'], self.playersOnMatchAndItsOppenent.get(self.scope['user'])
            try:
                self.playerWantsToPlay.remove(self.scope['user'])
                print(f"{self.scope['user']} Removed From Q")
            except:
                print(f"{self.scope['user']} Play And Finish Alraedy")
            destroyThisGameInformations(self.playersOnMatchAndItsOppenent,
                            self.playersOnMatchAndItsRoomId, player1, player2)
            await self.channel_layer.group_discard(roomidForThisUser, self.channel_name)
        except:
            pass
    
        
    async def ToFrontOnConnect(self, data):
        print("Sending Data To Clinet...")
        await self.send(data['Data'])
    async def endGame(self, data):
        print(f"WebSocket Will Be Closed Client: {self.scope['user']}")
        await self.close()

#Need To Hundle Tournement
class pongTourServer(AsyncWebsocketConsumer):
    async def connect(self):
        print(f"{self.scope['user']} Try To Connect On Tournement Server")
        await self.accept()
    async def receive(self, text_data, bytes_data=None):
        pass
    async def disconnect(self, code):
        pass
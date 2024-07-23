from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import onLobby, gameInfo, history
import os
from .checkClick import isLegalClick
from .destroyThisGameInfo import destroyThisGameInformations
import requests
from .roomCodes import roomcode
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
    playersOnMatchAndItsRole = dict()

    async def connect(self):
        print(f'----------User On Game Is: {self.scope["user"]}-------')
        try:
            gameInfo.objects.get(login=self.scope["user"])
            print(f"Welcome Back {self.scope['user']}")
        except:
            print(f"Welcome To The Game {self.scope['user']}")
            addUserToDb = gameInfo(login=self.scope['user'], codeToPlay=roomcode(self.scope['user']))
            addUserToDb.save()
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
                self.playersOnMatchAndItsRole[player1] = 'X'
                self.playersOnMatchAndItsRole[player2] = 'O'
                await self.channel_layer.group_add(roomid, self.channel_name)
                self.playerWantsToPlay.remove(self.playerWantsToPlay[0])
                await self.accept()
                user1 = gameInfo.objects.get(login=player1)
                user1.gamesPlayed += 1
                user1.save()
                user2 = gameInfo.objects.get(login=player2)
                user2.gamesPlayed += 1
                user2.save()
                toFrontEnd = json.dumps({'player1': player1, 'player2': player2, 'roomid': roomid})
                print(f"Player1: {player1}, Player2: {player2}, RoomId: {roomid}")
                await self.channel_layer.group_send(roomid, {'type': 'ToFrontOnConnect', 'Data': toFrontEnd})
            print(f"Still In Q: {len(self.playerWantsToPlay)}")

    async def receive(self, text_data, bytes_data=0):
        print(f'----------Data Come From User: {self.scope["user"]}-------')
        print(f"Data From Type: {type(text_data)} ==> {text_data}")
        print("DONE!")
        dataFromClient = json.loads(text_data)
        try:
            thisUser, hisOppenent = self.scope["user"], self.playersOnMatchAndItsOppenent.get(self.scope["user"])
            if dataFromClient.get("gameStatus") == "onprogress":
                if self.playersOnMatchAndItsRoomId.get(thisUser) == gameInfo.objects.get(login=thisUser).codeToPlay:
                    symbol = 'X'
                else:
                    symbol = 'O'
                board = dataFromClient.get('board')
                isLegalClick(board, symbol, thisUser)
                pos = dataFromClient.get('position')
                board = board[:pos] + symbol + board[pos + 1:]
                roomidForThisUser = self.playersOnMatchAndItsRoomId.get(thisUser)
                print(f"Id To Send Data: {roomidForThisUser}")
                toFrontEnd = json.dumps({
                    'etat': "PLAYING",
                    'user': thisUser,
                    'oppenent': hisOppenent,
                    'position': dataFromClient.get('position'),
                    'x_o': symbol,
                    'board': board
                    })
                if roomidForThisUser is not None:
                    await self.channel_layer.group_send(roomidForThisUser, {'type': 'ToFrontOnPlaying', 'Data': toFrontEnd})
            elif dataFromClient.get("gameStatus") == "winner":
                roomidForThisUser = self.playersOnMatchAndItsRoomId.get(thisUser)
                Winner, loser = gameInfo.objects.get(login=thisUser), gameInfo.objects.get(login=hisOppenent)
                print(f"Winner {Winner.login}: Wins: {Winner.wins} + 1")
                print(f"Loser {loser.login}: Loses: {loser.loses} + 1")
                Winner.wins += 1
                Winner.save()
                loser.loses += 1
                loser.save()
                print(f"Add Historic Of The Match Between {thisUser} and {hisOppenent}")
                user1,user2 =history(you=thisUser,oppenent=hisOppenent,winner=thisUser),history(you=hisOppenent,oppenent=thisUser,winner=thisUser)
                user1.save()
                user2.save()
                try:
                    destroyThisGameInformations(self.playersOnMatchAndItsOppenent,
                                                self.playersOnMatchAndItsRoomId,
                                                self.playersOnMatchAndItsRole, thisUser, hisOppenent)
                except:
                    print("ERROR HAPPENED WHEN DESTROY GAME")
                await self.channel_layer.group_send(roomidForThisUser, {'type': 'endGame', 'Data': "EMPTY"})
            elif dataFromClient.get("gameStatus") == "draw":
                roomidForThisUser = self.playersOnMatchAndItsRoomId.get(thisUser)
                p1, p2 = gameInfo.objects.get(login=thisUser), gameInfo.objects.get(login=hisOppenent)
                p1.draws += 1
                p1.save()
                p2.draws += 1
                p2.save()
                print(f"Add Historic Of The Match Between {thisUser} and {hisOppenent}")
                user1,user2 =history(you=thisUser,oppenent=hisOppenent,winner="DRAW"),history(you=hisOppenent,oppenent=thisUser,winner="DRAW")
                user1.save()
                user2.save()
                try:
                    destroyThisGameInformations(self.playersOnMatchAndItsOppenent,
                                                self.playersOnMatchAndItsRoomId,
                                                self.playersOnMatchAndItsRole, thisUser, hisOppenent)
                except:
                    print("ERROR HAPPENED WHEN DESTROY GAME")
                await self.channel_layer.group_send(roomidForThisUser, {'type': 'endGame', 'Data': "EMPTY"})
            elif dataFromClient.get("gameStatus") == "closed":
                roomidForThisUser = self.playersOnMatchAndItsRoomId.get(thisUser)
                leftedGame, Win = gameInfo.objects.get(login=thisUser), gameInfo.objects.get(login=hisOppenent)
                leftedGame.loses += 1
                leftedGame.save()
                Win.wins +=1
                Win.save()
                print(f"Add Historic Of The Match Between {thisUser} and {hisOppenent}")
                user1,user2 =history(you=thisUser,oppenent=hisOppenent,winner=hisOppenent),history(you=hisOppenent,oppenent=thisUser,winner=hisOppenent)
                user1.save()
                user2.save()
                try:
                    destroyThisGameInformations(self.playersOnMatchAndItsOppenent,
                                                self.playersOnMatchAndItsRoomId,
                                                self.playersOnMatchAndItsRole, thisUser, hisOppenent)
                except:
                    print("ERROR HAPPENED WHEN DESTROY GAME")
                await self.channel_layer.group_send(roomidForThisUser, {'type': 'endGame', 'Data': "EMPTY"})

        except:
            pass

    async def disconnect(self, code):
        print(f"Connection Of User: {self.scope['user']} Lost")
        try:
            roomidForThisUser = self.playersOnMatchAndItsRoomId.get(self.scope["user"])
            player1, player2 = self.scope['user'], self.playersOnMatchAndItsOppenent.get(self.scope['user'])
            try:
                self.playerWantsToPlay.remove(self.scope['user'])
                print(f"{self.scope['user']} Removed From Q")
            except:
                print(f"{self.scope} Play And Finish Alraedy")
            destroyThisGameInformations(self.playersOnMatchAndItsOppenent,
                            self.playersOnMatchAndItsRoomId,
                            self.playersOnMatchAndItsRole, player1, player2)
            await self.channel_layer.group_discard(roomidForThisUser, self.channel_name)
        except:
            pass
    
    async def ToFrontOnConnect(self, data):
        print("Sending Data To Clinet...")
        await self.send(data['Data'])
    
    async def ToFrontOnPlaying(self, data):
        print("Sending Data To Clinet...")
        await self.send(data['Data'])
    async def endGame(self, data):
        print("WebSocker Will Be Closed")
        await self.close()
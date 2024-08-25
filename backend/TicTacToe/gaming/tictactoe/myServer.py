from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import gameInfo, history, playerAndHisPic
import os
from .checkClick import isLegalClick
from .destroyThisGameInfo import destroyThisGameInformations
from .roomCodes import roomcode
import threading
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"


def saveData(self):
    addUserToDb = gameInfo(login=self.scope['user'], codeToPlay=roomcode(self.scope['user']))
    addUserToDb.save()
    print(f"gameInfo += {gameInfo.objects.get(login=self.scope['user'])}")
    addUserPic = playerAndHisPic(login=self.scope['user'], pic=self.scope['pic'])
    addUserPic.save()
    print(f"playerAndHisPic += {playerAndHisPic.objects.get(login=self.scope['user'])}")
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
            addUserToDbs = threading.Thread(target=saveData(self))
            addUserToDbs.start()
            addUserToDbs.join()
        if len(self.playerWantsToPlay) == 0:
            player1, player2 = self.scope['user'], ""
            if self.playersOnMatchAndItsOppenent.get(player1) is not None:
                await self.accept()
                player2 = self.playersOnMatchAndItsOppenent.get(player1)
                print(f"Can't Add Player {player1} To Q His Alraedy In Match")
                user1 = gameInfo.objects.get(login=player1)
                user1.loses += 1
                user1.save()
                user2 = gameInfo.objects.get(login=player2)
                user2.wins += 1
                user1.save()
                print(f"And This Counted As Win For {player2} Against {player1}")
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
            if player1 == player2:
                self.accept()
                print(f"{player1} Deux Fois")
                try:
                    self.playerWantsToPlay.remove(player1)
                except:
                    pass
                await self.close()
            elif self.playersOnMatchAndItsRoomId.get(player2) is not None:
                self.accept()
                print(f"Can't Add Player {player2} To Game With {player1} His Alraedy In Match")
                user1 = gameInfo.objects.get(login=player1)
                user1.loses += 1
                user1.save()
                user2 = gameInfo.objects.get(login=player2)
                user2.wins += 1
                user1.save()
                print(f"And This Counted As Win For {player2} Against {player1}")
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
                print("Still On Progress")
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
                thisUser = dataFromClient.get('winner')
                hisOppenent = self.playersOnMatchAndItsOppenent.get(thisUser)
                if thisUser is None or hisOppenent is None:
                    return
                print(f"{thisUser} Won {hisOppenent}")
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
                toFront = json.dumps({'etat': 'end', 'winner': thisUser, 'loser': hisOppenent,
                    'winnerPic': playerAndHisPic.objects.get(login=thisUser).pic,
                    'loserPic': playerAndHisPic.objects.get(login=hisOppenent).pic,
                    'res':'NODRAW'})
                await self.channel_layer.group_send(roomidForThisUser, {'type': 'endGame', 'Data': toFront})
            elif dataFromClient.get("gameStatus") == "draw":
                if thisUser is None or hisOppenent is None:
                    return
                print(f"Draw Between {thisUser} and {hisOppenent} ")
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
                toFront = json.dumps({'etat': 'end', 'winner': hisOppenent , 'loser': thisUser,
                        'winnerPic': playerAndHisPic.objects.get(login=hisOppenent).pic,
                        'loserPic': playerAndHisPic.objects.get(login=thisUser).pic,
                        'res': 'DRAW'})
                await self.channel_layer.group_send(roomidForThisUser, {'type': 'endGame', 'Data': toFront})
            elif dataFromClient.get("gameStatus") == "closed":
                if self.playersOnMatchAndItsOppenent.get(thisUser) is not None:
                    print(f"{thisUser} Will Lose The Match Cuase He Left The Game")
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
                    print(f"Try Destroy Data")
                    destroyThisGameInformations(self.playersOnMatchAndItsOppenent,
                                                self.playersOnMatchAndItsRoomId,
                                                self.playersOnMatchAndItsRole, thisUser, hisOppenent)
                    print(f"Data For {thisUser} Destroyed")
                    toFront = json.dumps({'etat': 'end', 'winner': hisOppenent , 'loser': thisUser,
                        'winnerPic': playerAndHisPic.objects.get(login=hisOppenent).pic,
                        'loserPic': playerAndHisPic.objects.get(login=thisUser).pic,
                        'res': 'NODRAW'})
                    await self.channel_layer.group_send(roomidForThisUser, {'type': 'endGame', 'Data': toFront})
                else:
                    try:
                        self.playerWantsToPlay.remove(thisUser)
                        print(f"{thisUser} Left Without Playing")
                        roomId = gameInfo.objects.get(login=thisUser).codeToPlay
                        await self.channel_layer.group_discard(roomId, self.channel_name)
                        await self.close()
                    except:
                        print(f"{thisUser} Not In The Q At All")
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
                print(f"{self.scope['user']} Play And Finish Alraedy")
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
        print(f"WebSocker Will Be Closed Client = {self.scope['user']}")
        await self.send(data['Data'])
        await self.close()
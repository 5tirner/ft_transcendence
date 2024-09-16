from channels.generic.websocket import AsyncJsonWebsocketConsumer, AsyncWebsocketConsumer
from .models import pongGameInfo, pongHistory, playerAndHisPic
import os
from .destroyGameInfo import destroyThisGameInformations
from .generateCode import roomcode
import random
import threading
import json
import asyncio
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"


def saveData(self):
    addUserToDB = pongGameInfo(login=self.scope['user'], codeToPlay=roomcode(self.scope['user']))
    addUserToDB.save()
    print(f"pongInfo += {pongGameInfo.objects.get(login=self.scope['user'])}")
    addUserPic = playerAndHisPic(login=self.scope['user'], pic=self.scope['pic'])
    addUserPic.save()
    print(f"playerAndHisPic += {playerAndHisPic.objects.get(login=self.scope['user'])}")

class freindReqPong(AsyncJsonWebsocketConsumer):
    roomcodeToJoin = dict()
    playersOnMatchAndItsRoomId = dict()
    playersOnMatchAndItsOppenent = dict()
    playersOnMatchAndItsDeriction = dict()
    async def connect(self):
        print(f'----------User On Game Is: {self.scope["user"]}-------')
        try:
            pongGameInfo.objects.get(login=self.scope['user'])
            print(f"Welcome Back {self.scope['user']}.")
        except:
            print(f"It's Your First Time Here {self.scope['user']}! Welcome.")
            addUserToDbs = threading.Thread(target=saveData(self))
            addUserToDbs.start()
            addUserToDbs.join()
            print(f"{self.scope['user']} Added Succusfully")
        print(f"Url Route RoomCode Of This User: {self.scope['url_route']['kwargs']}")
        roomcode = self.scope['url_route']['kwargs'].get('roomdcode')
        try:
            user = self.roomcodeToJoin.get(roomcode)
            if user is None:
                raise "User Not Found"
            print(f"User: {user}")
            self.playersOnMatchAndItsOppenent[user] = self.scope['user']
            self.playersOnMatchAndItsOppenent[self.scope['user']] = user
            self.playersOnMatchAndItsDeriction[self.scope['user']] = 'Right'
            self.playersOnMatchAndItsDeriction[user] = 'Left'
            inQue = pongGameInfo.objects.get(login=user)
            appearNow = pongGameInfo.objects.get(login=self.scope['user'])
            inQue.gamesPlayed += 1
            inQue.save()
            appearNow.gamesPlayed += 1
            appearNow.save()
            roomIdToPlay = inQue.codeToPlay
            self.playersOnMatchAndItsRoomId[user] = roomIdToPlay
            self.playersOnMatchAndItsRoomId[self.scope['user']] = roomIdToPlay
            self.roomcodeToJoin.pop(roomcode)
            player1 = user
            player2 = self.scope['user']
        except:
            self.roomcodeToJoin[roomcode] = self.scope['user']
            player1 = self.scope['user']
            player2 = ''
            roomIdToPlay = pongGameInfo.objects.get(login=self.scope['user']).codeToPlay
        await self.channel_layer.group_add(roomIdToPlay, self.channel_name)
        await self.accept()
        dataToSend = {'player1': player1, 'player2': player2, 'roomid': roomIdToPlay}
        await self.channel_layer.group_send(roomIdToPlay, {'type': 'toFront', 'Data': dataToSend})
    async def receive_json(self, dataFromClient, bytes_data=None):
        try:
            # print(dataFromClient)
            thisUser = self.scope['user']
            oppenent = self.playersOnMatchAndItsOppenent.get(self.scope['user'])
            roomidForThisUser = self.playersOnMatchAndItsRoomId.get(thisUser)
            if dataFromClient.get('gameStatus') == "onprogress":
                BallRoute = dataFromClient.get('BallRoute')
                BallDirection = dataFromClient.get('BallDir')
                ballx = dataFromClient.get('ballx')
                bally = dataFromClient.get('bally')
                paddle1 = dataFromClient.get('paddle1')
                paddle2 = dataFromClient.get('paddle2') 
                if dataFromClient.get('move') == "UP":
                    if self.playersOnMatchAndItsRoomId.get(thisUser) == pongGameInfo.objects.get(login=thisUser).codeToPlay:
                        paddle1 -= 20
                    else:
                        paddle2 -= 20
                elif dataFromClient.get('move') == "DOWN":
                    if self.playersOnMatchAndItsRoomId.get(thisUser) == pongGameInfo.objects.get(login=thisUser).codeToPlay:
                        paddle1 += 20
                    else:
                        paddle2 += 20
                elif dataFromClient.get('move') == "BALL":
                    if BallRoute == "UP":
                        if bally - 2 >= 10:
                            bally -= 2
                        else:
                            BallRoute = "DOWN"
                    elif BallRoute == "DOWN":
                        if bally + 2 <= 290:
                            bally += 2
                        else:
                            BallRoute = "UP"
                    if (BallDirection == "LEFT"):
                        ballx -= 5
                        if ballx == 30 and bally + 10 >= paddle1 and bally - 10 <= paddle1 + 50:
                            if (bally < paddle1 + 25):
                                BallRoute = "UP"
                            elif (bally > paddle1 + 25):
                                BallRoute = "DOWN"
                            BallDirection = "RIGHT"
                    elif (BallDirection == "RIGHT"):
                        ballx += 5
                        if ballx == 570 and bally + 10 >= paddle2 and bally - 10 <= paddle2 + 50:
                            if (bally < paddle2 + 25):
                                BallRoute = "UP"
                            elif (bally > paddle2 + 25):
                                BallRoute = "DOWN"
                            BallDirection = "LEFT"
                toFront = {
                        'MoveFor': dataFromClient.get('WhatIGiveYou'),
                        'paddle1': paddle1,
                        'paddle2': paddle2,
                        'player1': thisUser,
                        'player2': oppenent,
                        'Ballx': ballx, 'Bally' :bally,
                        'BallDir': BallDirection, 'BallRoute': BallRoute,
                    }
                await self.channel_layer.group_send(roomidForThisUser, {'type': 'toFront', 'Data': toFront})
            elif dataFromClient.get('gameStatus') == "closed":
                print(f"{self.scope['user']} Left")
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
                                                self.playersOnMatchAndItsRoomId,
                                                self.playersOnMatchAndItsDeriction, thisUser, oppenent)
                    print(f"Data For {thisUser} Destroyed")
                    toFront = {'MoveFor': 'end', 'winner': Win.login, 'loser': leftedGame.login,
                            'winnerPic': playerAndHisPic.objects.get(login=Win.login).pic,
                            'loserPic': playerAndHisPic.objects.get(login=leftedGame.login).pic}
                    print(f"=> {toFront}")
                    await self.channel_layer.group_send(roomidForThisUser, {'type': 'endGame', 'Data': toFront})
                else:
                    try:
                        # self.playerWantsToPlay.remove(thisUser)
                        # print(f"{thisUser} Left Without Playing")
                        roomId = pongGameInfo.objects.get(login=thisUser).codeToPlay
                        await self.channel_layer.group_discard(roomId, self.channel_name)
                        await self.close()
                    except:
                        print(f"{thisUser} Not In The Q At All")
            elif dataFromClient.get('gameStatus') == "End":
                print("ENDING....")
                if self.playersOnMatchAndItsDeriction.get(thisUser) == "Left" and dataFromClient.get('Side') == "LEFT":
                    loser = thisUser
                    winner = oppenent
                elif self.playersOnMatchAndItsDeriction.get(thisUser) == "Right" and dataFromClient.get('Side') == "RIGHT":
                    loser = thisUser
                    winner = oppenent
                else:
                    winner = thisUser
                    loser = oppenent
                if winner is None or loser is None:
                    return
                print(f"Player Side {self.playersOnMatchAndItsDeriction.get(thisUser)}")
                print(f"Goal Side {dataFromClient.get('Side')}")
                print(f"The Game Is End, {winner} Won {loser}")
                try:
                    roomId = self.playersOnMatchAndItsRoomId.get(thisUser)
                    Wuser = pongGameInfo.objects.get(login=winner)
                    Luser = pongGameInfo.objects.get(login=loser)
                    Wuser.wins += 1
                    Wuser.save()
                    Luser.loses += 1
                    Luser.save()
                    print(f"Add Historic Of The Match Between {thisUser} and {oppenent}")
                    user1 = pongHistory(you=thisUser,oppenent=oppenent,winner=winner)
                    user2 = pongHistory(you=oppenent,oppenent=thisUser,winner=winner)
                    user1.save()
                    user2.save()
                    destroyThisGameInformations(self.playersOnMatchAndItsOppenent,
                                                self.playersOnMatchAndItsRoomId,
                                                self.playersOnMatchAndItsDeriction , thisUser, oppenent)
                    toFront = {'MoveFor': 'end', 'winner': winner, 'loser': loser,
                        'winnerPic': playerAndHisPic.objects.get(login=winner).pic,
                        'loserPic': playerAndHisPic.objects.get(login=loser).pic}
                    print(f"=> {toFront}")
                    await self.channel_layer.group_send(roomId, {'type': 'endGame', 'Data': toFront})
                except:
                    print(f"{thisUser} Already End And This Match Counted")
        except:
            pass
    async def disconnect(self, code):
        print(f"DISCONNECT: User {self.scope['user']} Lost Connection")
        try:
            roomidForThisUser = self.playersOnMatchAndItsRoomId.get(self.scope["user"])
            player1, player2 = self.scope['user'], self.playersOnMatchAndItsOppenent.get(self.scope['user'])
            # try:
            #     self.playerWantsToPlay.remove(self.scope['user'])
            #     print(f"{self.scope['user']} Removed From Q")
            # except:
            #     print(f"{self.scope['user']} Play And Finish Alraedy")
            destroyThisGameInformations(self.playersOnMatchAndItsOppenent,
                            self.playersOnMatchAndItsRoomId, self.playersOnMatchAndItsDeriction, player1, player2)
            if roomidForThisUser is not None:
                await self.channel_layer.group_discard(roomidForThisUser, self.channel_name)
                print("Channel Discard")
        except:
            pass

    async def toFront(self, data):
        await self.send_json(data['Data'])
    async def endGame(self, data):
        print(f"ENDGAME: WebSocket Will Be Closed Client: {self.scope['user']}")
        await self.send_json(data['Data'])
        await self.close()

class myPongserver(AsyncJsonWebsocketConsumer):
    playerWantsToPlay = list()
    playersOnMatchAndItsRoomId = dict()
    playersOnMatchAndItsOppenent = dict()
    playersOnMatchAndItsDeriction = dict()
    async def connect(self):
        print(f'----------User On Game Is: {self.scope["user"]}-------')
        try:
            pongGameInfo.objects.get(login=self.scope['user'])
            print(f"Welcome Back {self.scope['user']}.")
        except:
            print(f"It's Your First Time Here {self.scope['user']}! Welcome.")
            addUserToDbs = threading.Thread(target=saveData(self))
            addUserToDbs.start()
            addUserToDbs.join()
            print(f"{self.scope['user']} Added Succusfully")
        if len(self.playerWantsToPlay) == 0:
            player1, player2 = self.scope['user'], ""
            print("Vide Q")
            if self.playersOnMatchAndItsOppenent.get(player1) is not None:
                self.scope['user'] = "Bad One"
                await self.accept()
                await self.close()
                return
            else:
                roomid = pongGameInfo.objects.get(login=self.scope["user"]).codeToPlay
                self.playerWantsToPlay.append(self.scope['user'])
                print(f"{self.scope['user']} Alone In The Q, He Waiting")
                await self.channel_layer.group_add(roomid, self.channel_name)
                await self.accept()
                toFronEnd = {'player1': player1, 'player2': player2, 'roomid': roomid}
                print(f"Player1: {player1}, Player2: {player2}, RoomId: {roomid}")
                await self.channel_layer.group_send(roomid, {'type': 'ToFrontOnConnect', 'Data': toFronEnd})
        else:
            player1, player2 = self.playerWantsToPlay[0], self.scope['user']
            print("Player Waiting...")
            if player1 == player2:
                self.scope['user'] = "Bad One"
                await self.accept()
                await self.close()
                return
            elif self.playersOnMatchAndItsRoomId.get(player2) is not None:
                self.scope['user'] = "Bad One"
                await self.accept()
                await self.close()
                return
            else:
                print(f"{self.scope['user']} Will Joinned To The Player {self.playerWantsToPlay[0]}")
                roomid = pongGameInfo.objects.get(login=self.playerWantsToPlay[0]).codeToPlay
                self.playersOnMatchAndItsOppenent[player1] = player2
                self.playersOnMatchAndItsOppenent[player2] = player1
                self.playersOnMatchAndItsRoomId[player1] = roomid
                self.playersOnMatchAndItsRoomId[player2] = roomid
                self.playersOnMatchAndItsDeriction[player1] = "Left"
                self.playersOnMatchAndItsDeriction[player2] = "Right"
                await self.channel_layer.group_add(roomid, self.channel_name)
                self.playerWantsToPlay.remove(self.playerWantsToPlay[0])
                await self.accept()
                user1 = pongGameInfo.objects.get(login=player1)
                user1.gamesPlayed += 1
                user1.save()
                user2 = pongGameInfo.objects.get(login=player2)
                user2.gamesPlayed += 1
                user2.save()
                toFrontEnd = {'player1': player1, 'player2': player2, 'roomid': roomid}
                print(f"Player1: {player1}, Player2: {player2}, RoomId: {roomid}")
                await self.channel_layer.group_send(roomid, {'type': 'ToFrontOnConnect', 'Data': toFrontEnd})
            print(f"Still In Q: {len(self.playerWantsToPlay)}")
    async def receive_json(self, dataFromClient, bytes_data=None):
        try:
            # print(dataFromClient)
            thisUser = self.scope['user']
            oppenent = self.playersOnMatchAndItsOppenent.get(self.scope['user'])
            roomidForThisUser = self.playersOnMatchAndItsRoomId.get(thisUser)
            if dataFromClient.get('gameStatus') == "onprogress":
                BallRoute = dataFromClient.get('BallRoute')
                BallDirection = dataFromClient.get('BallDir')
                ballx = dataFromClient.get('ballx')
                bally = dataFromClient.get('bally')
                paddle1 = dataFromClient.get('paddle1')
                paddle2 = dataFromClient.get('paddle2') 
                if dataFromClient.get('move') == "UP":
                    if self.playersOnMatchAndItsRoomId.get(thisUser) == pongGameInfo.objects.get(login=thisUser).codeToPlay:
                        paddle1 -= 20
                    else:
                        paddle2 -= 20
                elif dataFromClient.get('move') == "DOWN":
                    if self.playersOnMatchAndItsRoomId.get(thisUser) == pongGameInfo.objects.get(login=thisUser).codeToPlay:
                        paddle1 += 20
                    else:
                        paddle2 += 20
                elif dataFromClient.get('move') == "BALL":
                    if BallRoute == "UP":
                        if bally - 2 >= 10:
                            bally -= 2
                        else:
                            BallRoute = "DOWN"
                    elif BallRoute == "DOWN":
                        if bally + 2 <= 290:
                            bally += 2
                        else:
                            BallRoute = "UP"
                    if (BallDirection == "LEFT"):
                        ballx -= 5
                        if ballx == 30 and bally + 10 >= paddle1 and bally - 10 <= paddle1 + 50:
                            if (bally < paddle1 + 25):
                                BallRoute = "UP"
                            elif (bally > paddle1 + 25):
                                BallRoute = "DOWN"
                            BallDirection = "RIGHT"
                    elif (BallDirection == "RIGHT"):
                        ballx += 5
                        if ballx == 570 and bally + 10 >= paddle2 and bally - 10 <= paddle2 + 50:
                            if (bally < paddle2 + 25):
                                BallRoute = "UP"
                            elif (bally > paddle2 + 25):
                                BallRoute = "DOWN"
                            BallDirection = "LEFT"
                toFront = {
                        'MoveFor': dataFromClient.get('WhatIGiveYou'),
                        'paddle1': paddle1,
                        'paddle2': paddle2,
                        'player1': thisUser,
                        'player2': oppenent,
                        'Ballx': ballx, 'Bally' :bally,
                        'BallDir': BallDirection, 'BallRoute': BallRoute,
                    }
                await self.channel_layer.group_send(roomidForThisUser, {'type': 'ToFrontOnConnect', 'Data': toFront})
            elif dataFromClient.get('gameStatus') == "closed":
                print(f"{self.scope['user']} Left")
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
                                                self.playersOnMatchAndItsRoomId,
                                                self.playersOnMatchAndItsDeriction, thisUser, oppenent)
                    print(f"Data For {thisUser} Destroyed")
                    toFront = {'MoveFor': 'end', 'winner': Win.login, 'loser': leftedGame.login,
                            'winnerPic': playerAndHisPic.objects.get(login=Win.login).pic,
                            'loserPic': playerAndHisPic.objects.get(login=leftedGame.login).pic}
                    print(f"=> {toFront}")
                    await self.channel_layer.group_send(roomidForThisUser, {'type': 'endGame', 'Data': toFront})
                else:
                    try:
                        self.playerWantsToPlay.remove(thisUser)
                        print(f"{thisUser} Left Without Playing")
                        roomId = pongGameInfo.objects.get(login=thisUser).codeToPlay
                        await self.channel_layer.group_discard(roomId, self.channel_name)
                        await self.close()
                    except:
                        print(f"{thisUser} Not In The Q At All")
            elif dataFromClient.get('gameStatus') == "End":
                print("ENDING....")
                if self.playersOnMatchAndItsDeriction.get(thisUser) == "Left" and dataFromClient.get('Side') == "LEFT":
                    loser = thisUser
                    winner = oppenent
                elif self.playersOnMatchAndItsDeriction.get(thisUser) == "Right" and dataFromClient.get('Side') == "RIGHT":
                    loser = thisUser
                    winner = oppenent
                else:
                    winner = thisUser
                    loser = oppenent
                if winner is None or loser is None:
                    return
                print(f"Player Side {self.playersOnMatchAndItsDeriction.get(thisUser)}")
                print(f"Goal Side {dataFromClient.get('Side')}")
                print(f"The Game Is End, {winner} Won {loser}")
                try:
                    roomId = self.playersOnMatchAndItsRoomId.get(thisUser)
                    Wuser = pongGameInfo.objects.get(login=winner)
                    Luser = pongGameInfo.objects.get(login=loser)
                    Wuser.wins += 1
                    Wuser.save()
                    Luser.loses += 1
                    Luser.save()
                    print(f"Add Historic Of The Match Between {thisUser} and {oppenent}")
                    user1 = pongHistory(you=thisUser,oppenent=oppenent,winner=winner)
                    user2 = pongHistory(you=oppenent,oppenent=thisUser,winner=winner)
                    user1.save()
                    user2.save()
                    destroyThisGameInformations(self.playersOnMatchAndItsOppenent,
                                                self.playersOnMatchAndItsRoomId,
                                                self.playersOnMatchAndItsDeriction , thisUser, oppenent)
                    toFront = {'MoveFor': 'end', 'winner': winner, 'loser': loser,
                        'winnerPic': playerAndHisPic.objects.get(login=winner).pic,
                        'loserPic': playerAndHisPic.objects.get(login=loser).pic}
                    print(f"=> {toFront}")
                    await self.channel_layer.group_send(roomId, {'type': 'endGame', 'Data': toFront})
                except:
                    print(f"{thisUser} Already End And This Match Counted")
        except:
            pass
    async def disconnect(self, code):
        print(f"DISCONNECT: User {self.scope['user']} Lost Connection")
        try:
            roomidForThisUser = self.playersOnMatchAndItsRoomId.get(self.scope["user"])
            player1, player2 = self.scope['user'], self.playersOnMatchAndItsOppenent.get(self.scope['user'])
            try:
                self.playerWantsToPlay.remove(self.scope['user'])
                print(f"{self.scope['user']} Removed From Q")
            except:
                print(f"{self.scope['user']} Play And Finish Alraedy")
            destroyThisGameInformations(self.playersOnMatchAndItsOppenent,
                            self.playersOnMatchAndItsRoomId, self.playersOnMatchAndItsDeriction, player1, player2)
            if roomidForThisUser is not None:
                await self.channel_layer.group_discard(roomidForThisUser, self.channel_name)
                print("Channel Discard")
        except:
            pass
    
        
    async def ToFrontOnConnect(self, data):
        # print("Sending Data To Clinet...")
        await self.send_json(data['Data'])
    async def endGame(self, data):
        print(f"ENDGAME: WebSocket Will Be Closed Client: {self.scope['user']}")
        await self.send_json(data['Data'])
        await self.close()

# class pongLocalServer(AsyncJsonWebsocketConsumer):
#     randomAdd = random.choice([1, 2])
#     async def connect(self):
#         print(f"{self.scope['user']} Try To Play Local Server")
#         await self.accept()
#     async def receive_json(self, dataFromClient, bytes_data=None):
#         if dataFromClient.get('gameStatus') == "onprogress":
#             BallRoute = dataFromClient.get('BallRoute')
#             BallDirection = dataFromClient.get('BallDir')
#             ballx = dataFromClient.get('ballx')
#             bally = dataFromClient.get('bally')
#             paddle1 = dataFromClient.get('paddle1')
#             paddle2 = dataFromClient.get('paddle2')
#             if dataFromClient.get('move') == "W":
#                 paddle1 -= 20
#             elif dataFromClient.get('move') == "S":
#                 paddle1 += 20
#             elif dataFromClient.get('move') == "UP":
#                 paddle2 -= 20
#             elif dataFromClient.get('move') == "DOWN":
#                 paddle2 += 20
#             elif dataFromClient.get('move') == "BALL":
#                 if BallRoute == "UP":
#                     if bally - self.randomAdd >= 10:
#                         bally -= self.randomAdd
#                     else:
#                         BallRoute = "DOWN"
#                 elif BallRoute == "DOWN":
#                     if bally + self.randomAdd <= 290:
#                         bally += self.randomAdd
#                     else:
#                         BallRoute = "UP"
#                 if (BallDirection == "LEFT"):
#                     ballx -= 5
#                     if ballx == 30 and bally + 10 >= paddle1 and bally - 10 <= paddle1 + 50:
#                         if (bally < paddle1 + 25):
#                             BallRoute = "UP"
#                         elif (bally > paddle1 + 25):
#                             BallRoute = "DOWN"
#                         BallDirection = "RIGHT"
#                         self.randomAdd = random.choice([1, 2])
#                 elif (BallDirection == "RIGHT"):
#                     ballx += 5
#                     if ballx == 570 and bally + 10 >= paddle2 and bally - 10 <= paddle2 + 50:
#                         if (bally < paddle2 + 25):
#                             BallRoute = "UP"
#                         elif (bally > paddle2 + 25):
#                             BallRoute = "DOWN"
#                         BallDirection = "LEFT"
#                         self.randomAdd = random.choice([1, 2])
#             tofront = {
#                 'MoveFor': dataFromClient.get('WhatIGiveYou'),
#                 'paddle1': paddle1,
#                 'paddle2': paddle2,
#                 'Ballx': ballx, 'Bally' :bally,
#                 'BallDir': BallDirection, 'BallRoute': BallRoute,
#             }
#             try:
#                 await self.send_json(tofront)
#                 # await sleep(1)
#             except:
#                 print("Can't Send Data")
#         elif dataFromClient.get('gameStatus') == "End":
#             await self.disconnect(1000)
#     async def disconnect(self, code):
#         print(f"Local Game End")
#         await self.close(code)





#Ysabr local game
class PongConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print("WebSocket connection accepted")

        self.game_state = {
            'paddle1Y': (400 - 75) / 2,
            'paddle2Y': (400 - 75) / 2,
            'ballX': 800 / 2,
            'ballY': 400 / 2,
            'ballSpeedX': 3,
            'ballSpeedY': 2,
            'score1': 0,
            'score2': 0,
            'gameOver': False,
            'winnerMessage': ''
        }

    async def disconnect(self, close_code):
        await self.close()
        print(f"WebSocket connection closed with code: {close_code}")

    async def receive(self, text_data):
        data = json.loads(text_data)
        # print(f"Received data: {data}")

        if data.get('resetGame'):
            self.reset_game()
        else:
            if data.get('player1Up'):
                self.game_state['paddle1Y'] = max(self.game_state['paddle1Y'] - 8, 0)
            if data.get('player1Down'):
                self.game_state['paddle1Y'] = min(self.game_state['paddle1Y'] + 8, 400 - 75)
            if data.get('player2Up'):
                self.game_state['paddle2Y'] = max(self.game_state['paddle2Y'] - 8, 0)
            if data.get('player2Down'):
                self.game_state['paddle2Y'] = min(self.game_state['paddle2Y'] + 8, 400 - 75)

            self.update_ball_position()

            if self.game_state['score1'] >= 3:
                self.game_state['gameOver'] = True
                self.game_state['winnerMessage'] = 'Player 1 Wins!'
            elif self.game_state['score2'] >= 3:
                self.game_state['gameOver'] = True
                self.game_state['winnerMessage'] = 'Player 2 Wins!'

        # Send updated game state to the WebSocket
        await self.send(text_data=json.dumps(self.game_state))


    def update_ball_position(self):
        if not self.game_state['gameOver']:
            # Update ball position
            self.game_state['ballX'] += self.game_state['ballSpeedX']
            self.game_state['ballY'] += self.game_state['ballSpeedY']

            # Ball collision with top and bottom walls
            if self.game_state['ballY'] + 10 > 400 or self.game_state['ballY'] - 10 < 0:
                self.game_state['ballSpeedY'] = -self.game_state['ballSpeedY']

            # Ball collision with paddle 2 (right side)
            if self.game_state['ballX'] + self.game_state['ballSpeedX'] > 800 - 10 - 10:  # Ball moving towards the right edge
                if self.game_state['paddle2Y'] <= self.game_state['ballY'] <= self.game_state['paddle2Y'] + 75:
                    # Ball hits paddle 2, bounce back
                    self.game_state['ballSpeedX'] = -self.game_state['ballSpeedX']
                    deltaY = self.game_state['ballY'] - (self.game_state['paddle2Y'] + 75 / 2)
                    self.game_state['ballSpeedY'] = deltaY * 0.02
                elif self.game_state['ballX'] > 800:  # Ball goes out of bounds on the right
                    # Ball missed the paddle, score for player 1
                    self.game_state['score1'] += 1
                    self.reset_ball()

            # Ball collision with paddle 1 (left side)
            elif self.game_state['ballX'] + self.game_state['ballSpeedX'] < 10 + 10:  # Ball moving towards the left edge
                if self.game_state['paddle1Y'] <= self.game_state['ballY'] <= self.game_state['paddle1Y'] + 75:
                    # Ball hits paddle 1, bounce back
                    self.game_state['ballSpeedX'] = -self.game_state['ballSpeedX']
                    deltaY = self.game_state['ballY'] - (self.game_state['paddle1Y'] + 75 / 2)
                    self.game_state['ballSpeedY'] = deltaY * 0.02
                elif self.game_state['ballX'] < 0:  # Ball goes out of bounds on the left
                    # Ball missed the paddle, score for player 2
                    self.game_state['score2'] += 1
                    self.reset_ball()



    def reset_ball(self):
        self.game_state['ballX'] = 800 / 2
        self.game_state['ballY'] = 400 / 2
        self.game_state['ballSpeedX'] = -self.game_state['ballSpeedX']
        self.game_state['ballSpeedY'] = 1

    def reset_game(self):
        self.game_state = {
            'paddle1Y': (400 - 75) / 2,
            'paddle2Y': (400 - 75) / 2,
            'ballX': 800 / 2,
            'ballY': 400 / 2,
            'ballSpeedX': 3,
            'ballSpeedY': 2,
            'score1': 0,
            'score2': 0,
            'gameOver': False,
            'winnerMessage': ''
        }
#Need To Hundle Tournement
# class pongTourServer(AsyncJsonWebsocketConsumer):
#     TheWinners = list()
#     tournementGroups = list(dict())
#     playersOnMatchAndItsRoomId = dict()
#     playersOnMatchAndItsOppenent = dict()
#     playersOnMatchAndItsDeriction = dict()
    
#     async def connect(self):
#         print(f"[-----{self.scope['user']} Try To Connect On Tournement Server].------")
#         if self.playersOnMatchAndItsDeriction.get(self.scope['user']) is not None:
#             print(f"{self.scope['user']} Already In Another Game")
#             self.scope['user'] = "Bad One"
#             await self.accept()
#             await self.close()
#             return
#         if len(self.tournementGroups) == 0:
#             print(f"{self.scope['user']} Is The First One Joined To This Tour")
#             self.tournementGroups.append({'name': self.scope['user'], 'channel_name': self.channel_name})
#         elif len(self.tournementGroups) < 4:
#             for i in self.tournementGroups:
#                 if i.get('name') == self.scope['user']:
#                     self.scope['user'] = "Bad One"
#                     await self.accept()
#                     await self.close()
#                     return
#             print(f"{self.scope['user']} Will Joined To This List Of Players:")
#             print(f"-> {self.tournementGroups}")
#             self.tournementGroups.append({'name': self.scope['user'], 'channel_name': self.channel_name})
#             if len(self.tournementGroups) == 4:
#                 player1 = self.tournementGroups[0].get('name')
#                 player2 = self.tournementGroups[1].get('name')
#                 player3 = self.tournementGroups[2].get('name')
#                 player4 = self.tournementGroups[3].get('name')
#                 print("---------------------- Players On Tour ---------------------")
#                 print(player1)
#                 print(player2)
#                 print(player3)
#                 print(player4)
#                 self.playersOnMatchAndItsRoomId[player1] = pongGameInfo.objects.get(login=player1).codeToPlay
#                 self.playersOnMatchAndItsRoomId[player3] = pongGameInfo.objects.get(login=player1).codeToPlay
#                 self.playersOnMatchAndItsOppenent[player1] = player3
#                 self.playersOnMatchAndItsOppenent[player3] = player1
#                 self.playersOnMatchAndItsDeriction[player1] = "Left"
#                 self.playersOnMatchAndItsDeriction[player3]  = "Right"
#                 await self.channel_layer.group_add(self.playersOnMatchAndItsRoomId.get(player1),
#                                              self.tournementGroups[0].get('channel_name'))
#                 await self.channel_layer.group_add(self.playersOnMatchAndItsRoomId.get(player1),
#                                              self.tournementGroups[2].get('channel_name'))
#                 self.playersOnMatchAndItsRoomId[player2] = pongGameInfo.objects.get(login=player2).codeToPlay
#                 self.playersOnMatchAndItsRoomId[player4] = pongGameInfo.objects.get(login=player2).codeToPlay
#                 self.playersOnMatchAndItsOppenent[player2] = player4
#                 self.playersOnMatchAndItsOppenent[player4] = player2
#                 self.playersOnMatchAndItsDeriction[player2] = "Left"
#                 self.playersOnMatchAndItsDeriction[player4]  = "Right"
#                 await self.channel_layer.group_add(self.playersOnMatchAndItsRoomId.get(player2),
#                                              self.tournementGroups[1].get('channel_name'))
#                 await self.channel_layer.group_add(self.playersOnMatchAndItsRoomId.get(player2),
#                                              self.tournementGroups[3].get('channel_name'))
#         await self.accept()
#         if len(self.tournementGroups) == 4:
#             self.tournementGroups.clear()
#             try:
#                 toFront1 = {'player1': player1, 'player2': player3, 'roomid': self.playersOnMatchAndItsRoomId.get(player1)}
#                 toFront2 = {'player1': player2, 'player2': player4, 'roomid': self.playersOnMatchAndItsRoomId.get(player2)}
#                 await self.channel_layer.group_send(self.playersOnMatchAndItsRoomId.get(player1),
#                         {'type': 'ToFrontOnConnect', 'Data': toFront1})
#                 await self.channel_layer.group_send(self.playersOnMatchAndItsRoomId.get(player2),
#                         {'type': 'ToFrontOnConnect', 'Data': toFront2})
#             except:
#                 pass

#     async def receive_json(self, dataFromClient, bytes_data=None):
#         try:
#             thisUser = self.scope['user']
#             oppenent = self.playersOnMatchAndItsOppenent.get(self.scope['user'])
#             roomidForThisUser = self.playersOnMatchAndItsRoomId.get(thisUser)
#             if dataFromClient.get('gameStatus') == "onprogress":
#                 BallRoute = dataFromClient.get('BallRoute')
#                 BallDirection = dataFromClient.get('BallDir')
#                 ballx = dataFromClient.get('ballx')
#                 bally = dataFromClient.get('bally')
#                 paddle1 = dataFromClient.get('paddle1')
#                 paddle2 = dataFromClient.get('paddle2') 
#                 if dataFromClient.get('move') == "UP":
#                     if self.playersOnMatchAndItsRoomId.get(thisUser) == pongGameInfo.objects.get(login=thisUser).codeToPlay:
#                         paddle1 -= 20
#                     else:
#                         paddle2 -= 20
#                 elif dataFromClient.get('move') == "DOWN":
#                     if self.playersOnMatchAndItsRoomId.get(thisUser) == pongGameInfo.objects.get(login=thisUser).codeToPlay:
#                         paddle1 += 20
#                     else:
#                         paddle2 += 20
#                 elif dataFromClient.get('move') == "BALL":
#                     if BallRoute == "UP":
#                         if bally - 2 >= 10:
#                             bally -= 2
#                         else:
#                             BallRoute = "DOWN"
#                     elif BallRoute == "DOWN":
#                         if bally + 2 <= 290:
#                             bally += 2
#                         else:
#                             BallRoute = "UP"
#                     if (BallDirection == "LEFT"):
#                         ballx -= 2
#                         if ballx == 30 and bally + 10 >= paddle1 and bally - 10 <= paddle1 + 50:
#                             if (bally < paddle1 + 25):
#                                 BallRoute = "UP"
#                             elif (bally > paddle1 + 25):
#                                 BallRoute = "DOWN"
#                             BallDirection = "RIGHT"
#                     elif (BallDirection == "RIGHT"):
#                         ballx += 2
#                         if ballx == 570 and bally + 10 >= paddle2 and bally - 10 <= paddle2 + 50:
#                             if (bally < paddle2 + 25):
#                                 BallRoute = "UP"
#                             elif (bally > paddle2 + 25):
#                                 BallRoute = "DOWN"
#                             BallDirection = "LEFT"
#                 toFront = {
#                         'Round': 'SemiFinal',
#                         'MoveFor': dataFromClient.get('WhatIGiveYou'),
#                         'paddle1': paddle1,
#                         'paddle2': paddle2,
#                         'player1': thisUser,
#                         'player2': oppenent,
#                         'Ballx': ballx, 'Bally' :bally,
#                         'BallDir': BallDirection, 'BallRoute': BallRoute,
#                     }
#                 await self.channel_layer.group_send(roomidForThisUser, {'type': 'ToFrontOnConnect', 'Data': toFront})
#             elif dataFromClient.get('gameStatus') == "closed":
#                 print(f"{self.scope['user']} Left")
#                 if self.playersOnMatchAndItsOppenent.get(thisUser) is not None:
#                     print(f"{thisUser} Will Lose The Match Cuase He Left The Game")
#                     roomidForThisUser = self.playersOnMatchAndItsRoomId.get(thisUser)
#                     leftedGame, Win = pongGameInfo.objects.get(login=thisUser), pongGameInfo.objects.get(login=oppenent)
#                     leftedGame.loses += 1
#                     leftedGame.save()
#                     Win.wins +=1
#                     Win.save()
#                     print(f"Add Historic Of The Match Between {thisUser} and {oppenent}")
#                     user1 = pongHistory(you=thisUser,oppenent=oppenent,winner=oppenent)
#                     user2 = pongHistory(you=oppenent,oppenent=thisUser,winner=oppenent)
#                     user1.save()
#                     user2.save()
#                     print(f"Try Destroy Data")
#                     destroyThisGameInformations(self.playersOnMatchAndItsOppenent,
#                                                 self.playersOnMatchAndItsRoomId,
#                                                 self.playersOnMatchAndItsDeriction, thisUser, oppenent)
#                     print(f"Data For {thisUser} Destroyed")
#                     await self.channel_layer.group_send(roomidForThisUser, {'type': 'endGame', 'Data': "EMPTY"})
#                 else:
#                     try:
#                         self.tournementGroups.remove(thisUser)
#                         print(f"{thisUser} Left Without Playing")
#                         await self.close()
#                     except:
#                         print(f"{thisUser} Not In The Q At All")
#             elif dataFromClient.get('gameStatus') == "End":
#                 if self.playersOnMatchAndItsDeriction.get(thisUser) == "Left" and dataFromClient.get('Side') == "LEFT":
#                     loser = thisUser
#                     winner = oppenent
#                 elif self.playersOnMatchAndItsDeriction.get(thisUser) == "Right" and dataFromClient.get('Side') == "RIGHT":
#                     loser = thisUser
#                     winner = oppenent
#                 else:
#                     winner = thisUser
#                     loser = oppenent
#                 if winner is None or loser is None:
#                     return
#                 print(f"Player Side {self.playersOnMatchAndItsDeriction.get(thisUser)}")
#                 print(f"Goal Side {dataFromClient.get('Side')}")
#                 print(f"The Game Is End, {winner} Won {loser}")
#                 self.TheWinners.append(winner)
#                 print(f"Added To Winners List: {winner}")
#                 try:
#                     roomId = self.playersOnMatchAndItsRoomId.get(thisUser)
#                     Wuser = pongGameInfo.objects.get(login=winner)
#                     Luser = pongGameInfo.objects.get(login=loser)
#                     Wuser.wins += 1
#                     Wuser.save()
#                     Luser.loses += 1
#                     Luser.save()
#                     print(f"Add Historic Of The Match Between {thisUser} and {oppenent}")
#                     user1 = pongHistory(you=thisUser,oppenent=oppenent,winner=winner)
#                     user2 = pongHistory(you=oppenent,oppenent=thisUser,winner=winner)
#                     user1.save()
#                     user2.save()
#                     destroyThisGameInformations(self.playersOnMatchAndItsOppenent,
#                                                 self.playersOnMatchAndItsRoomId,
#                                                 self.playersOnMatchAndItsDeriction , thisUser, oppenent)
#                     toFront = {
#                         'Round': 'Final',
#                         'Winner': winner,
#                         'Loser': loser,
#                     }
#                     await self.channel_layer.group_send(roomId, {'type': 'FinalRound', 'Data': toFront})
#                 except:
#                     print(f"{thisUser} Already End And This Match Counted")
#             elif dataFromClient.get('gameStatus') == "NextRound":
#                 if self.scope['user'] in self.TheWinners:
#                     await self.send_json({'Round': "FinalRound"})
#                 else:
#                     await self.send_json({'Round': "NoRound"})
#         except:
#             pass


#     async def disconnect(self, code):
#         print(f"DISCONNECT: User {self.scope['user']} Lost Connection")
#         try:
#             roomidForThisUser = self.playersOnMatchAndItsRoomId.get(self.scope["user"])
#             player1, player2 = self.scope['user'], self.playersOnMatchAndItsOppenent.get(self.scope['user'])
#             try:
#                 self.playerWantsToPlay.remove(self.scope['user'])
#                 print(f"{self.scope['user']} Removed From Q")
#             except:
#                 print(f"{self.scope['user']} Play And Finish Alraedy")
#             destroyThisGameInformations(self.playersOnMatchAndItsOppenent,
#                             self.playersOnMatchAndItsRoomId, self.playersOnMatchAndItsDeriction,
#                             player1, player2)
#             if roomidForThisUser is not None:
#                 await self.channel_layer.group_discard(roomidForThisUser, self.channel_name)
#                 print("Channel Discard")
#         except:
#             pass

#     async def ToFrontOnConnect(self, data):
#         # print("Sending Data To Clinet...")
#         await self.send_json(data['Data'])
    
#     async def FinalRound(self, data):
#         await self.send_json(data['Data'])

class Finalist(AsyncJsonWebsocketConsumer):
    async def connect(self):
        
        await self.accept()
    async def receive(self, text_data=None, bytes_data=None):
        print(f"Clinet: {self.scope['user']}\nData: {text_data}")
    async def disconnect(self, code):
        await self.close()
        
        
        
#  Motherhugger ostora


class TournamentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.players = []
        self.matchups = []
        self.semi_final_matchups = []
        self.final_matchups = []
        self.winners = []
        self.losers = []
        self.semi_final_winners = []
        self.current_stage = "semi_finals"  # Track the current stage of the tournament
        self.current_match = 0
        self.current_game_loop_task = None  # Keep track of the current game loop task
        self.game_state = {
            'paddle1Y': (400 - 75) / 2,
            'paddle2Y': (400 - 75) / 2,
            'ballX': 800 / 2,
            'ballY': 400 / 2,
            'ballSpeedX': 2,
            'ballSpeedY': 2,
            'score1': 0,
            'score2': 0,
            'gameOver': False,
            'winner': ''
        }

    async def disconnect(self, close_code):
        if self.current_game_loop_task:
            self.current_game_loop_task.cancel()
        await self.close()
        print(f"WebSocket connection closed with code: {close_code}")

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        if action == 'submit_players':
            self.players = data.get('players')
            random.shuffle(self.players)
            self.matchups = [
                (self.players[0], self.players[1]),
                (self.players[2], self.players[3])
            ]
            # Store semi-final matchups separately
            self.semi_final_matchups = self.matchups.copy()
            await self.send(text_data=json.dumps({
                'status': 'success',
                'matchups': self.matchups,
            }))

        elif action == 'start_tournament':
            self.current_stage = "semi_finals"
            self.current_match = 0
            self.winners = []
            self.losers = []
            self.semi_final_winners = []
            await self.start_next_match()

        elif action == 'paddle_movement':
            self.handle_paddle_movement(data.get('player'), data.get('direction'))

    def handle_paddle_movement(self, player, direction):
        step_size = 2  # Adjust this value to control the paddle speed
        if player == 'player1':
            if direction == 'up':
                self.game_state['paddle1Y'] = max(self.game_state['paddle1Y'] - step_size, 0)
            elif direction == 'down':
                self.game_state['paddle1Y'] = min(self.game_state['paddle1Y'] + step_size, 400 - 75)
        elif player == 'player2':
            if direction == 'up':
                self.game_state['paddle2Y'] = max(self.game_state['paddle2Y'] - step_size, 0)
            elif direction == 'down':
                self.game_state['paddle2Y'] = min(self.game_state['paddle2Y'] + step_size, 400 - 75)

    async def start_next_match(self):
        if self.current_game_loop_task:
            self.current_game_loop_task.cancel()
        
        if self.current_stage == "semi_finals":
            if self.current_match < len(self.matchups):
                # Start semi-final matches
                player1, player2 = self.matchups[self.current_match]
                self.reset_game_state(player1, player2)
                await self.send(text_data=json.dumps({
                    'status': 'start_match',
                    'player1': player1,
                    'player2': player2,
                }))
                self.current_game_loop_task = asyncio.create_task(self.run_game_loop())
            else:
                # Transition to finals
                self.current_stage = "finals"
                self.current_match = 0
                # Correctly assign players for the finals and third-place match
                self.final_matchups = [
                    (self.losers[0], self.losers[1]),  # Third-place match
                    (self.winners[0], self.winners[1])  # Final match
                ]
                self.matchups = self.final_matchups  # Set matchups to final matchups
                await self.start_next_match()
        
        elif self.current_stage == "finals":
            if self.current_match < len(self.matchups):
                # Start third-place or final matches
                player1, player2 = self.matchups[self.current_match]
                self.reset_game_state(player1, player2)
                await self.send(text_data=json.dumps({
                    'status': 'start_match',
                    'player1': player1,
                    'player2': player2,
                }))
                self.current_game_loop_task = asyncio.create_task(self.run_game_loop())
            else:
                # Tournament complete
                tournament_winner = self.tournament_winner
                third_place_winner = self.third_place_winner
                await self.send(text_data=json.dumps({
                    'status': 'tournament_complete',
                    'winner': tournament_winner,
                    'semi_final_results': [
                        {'match': self.semi_final_matchups[i], 'winner': self.semi_final_winners[i]} for i in range(len(self.semi_final_matchups))
                    ],
                    'third_place_result': {'match': self.final_matchups[0], 'winner': third_place_winner},
                    'final_result': {'match': self.final_matchups[1], 'winner': tournament_winner},
                }))

    async def run_game_loop(self):
        while not self.game_state['gameOver']:
            self.update_ball_position()
            await self.send_game_state()
            await asyncio.sleep(0.02)

    def update_ball_position(self):
        if not self.game_state['gameOver']:
            # Update ball position
            self.game_state['ballX'] += self.game_state['ballSpeedX']
            self.game_state['ballY'] += self.game_state['ballSpeedY']

            # Ball collision with top and bottom walls
            if self.game_state['ballY'] - 10 < 0 or self.game_state['ballY'] + 10 > 400:
                self.game_state['ballSpeedY'] = -self.game_state['ballSpeedY']

            # Ball collision with paddles
            if self.game_state['ballX'] - 10 <= 10:  # Left paddle (Player 1)
                if self.game_state['paddle1Y'] < self.game_state['ballY'] < self.game_state['paddle1Y'] + 75:
                    self.game_state['ballSpeedX'] = -self.game_state['ballSpeedX']
                    deltaY = self.game_state['ballY'] - (self.game_state['paddle1Y'] + 75 / 2)
                    self.game_state['ballSpeedY'] += deltaY * 0.02  # Slight variation in speed based on hit point
                else:
                    self.game_state['score2'] += 1
                    self.reset_ball()

            elif self.game_state['ballX'] + 10 >= 800 - 10:  # Right paddle (Player 2)
                if self.game_state['paddle2Y'] < self.game_state['ballY'] < self.game_state['paddle2Y'] + 75:
                    self.game_state['ballSpeedX'] = -self.game_state['ballSpeedX']
                    deltaY = self.game_state['ballY'] - (self.game_state['paddle2Y'] + 75 / 2)
                    self.game_state['ballSpeedY'] += deltaY * 0.02  # Slight variation in speed based on hit point
                else:
                    self.game_state['score1'] += 1
                    self.reset_ball()

            # Check if someone won
            if self.game_state['score1'] >= 1:
                self.end_match(self.game_state['player1'])

            elif self.game_state['score2'] >= 1:
                self.end_match(self.game_state['player2'])

    def end_match(self, winner):
        self.game_state['gameOver'] = True
        self.game_state['winner'] = winner
        print("Winner: ", winner)

        current_matchup = self.matchups[self.current_match]
        loser = current_matchup[0] if winner != current_matchup[0] else current_matchup[1]
        
        if self.current_stage == "semi_finals":
            # Append the winner to the winners list and the loser to the losers list
            self.winners.append(winner)
            self.losers.append(loser)
            self.semi_final_winners.append(winner)
            print(f"Semi-final winners: {self.winners}, losers: {self.losers}")

        elif self.current_stage == "finals":
            if self.current_match == 0:  # Third place match
                # The first match in finals is the third-place match
                print(f"Third-place winner: {winner}")
                self.third_place_winner = winner
            else:  # Final match
                print(f"Final match winner: {winner}")
                self.tournament_winner = winner

        self.current_match += 1
        asyncio.create_task(self.start_next_match())

    def reset_ball(self):
        self.game_state['ballX'] = 800 / 2
        self.game_state['ballY'] = 400 / 2
        self.game_state['ballSpeedX'] = random.choice([-2, 2])
        self.game_state['ballSpeedY'] = random.choice([-2, 2])
        self.game_state['paddle1Y'] = (400 - 75) / 2
        self.game_state['paddle2Y'] = (400 - 75) / 2

    def reset_game_state(self, player1, player2):
        self.game_state = {
            'paddle1Y': (400 - 75) / 2,
            'paddle2Y': (400 - 75) / 2,
            'ballX': 800 / 2,
            'ballY': 400 / 2,
            'ballSpeedX': random.choice([-2, 2]),
            'ballSpeedY': random.choice([-2, 2]),
            'score1': 0,
            'score2': 0,
            'gameOver': False,
            'winner': '',
            'player1': player1,
            'player2': player2
        }

    async def send_game_state(self):
        await self.send(text_data=json.dumps(self.game_state))


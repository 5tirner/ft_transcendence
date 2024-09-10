from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import pongGameInfo, pongHistory, playerAndHisPic
import os
from .destroyGameInfo import destroyThisGameInformations
from .generateCode import roomcode
import random
import threading

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

class pongLocalServer(AsyncJsonWebsocketConsumer):
    randomAdd = random.choice([1, 2])
    async def connect(self):
        print(f"{self.scope['user']} Try To Play Local Server")
        await self.accept()
    async def receive_json(self, dataFromClient, bytes_data=None):
        if dataFromClient.get('gameStatus') == "onprogress":
            BallRoute = dataFromClient.get('BallRoute')
            BallDirection = dataFromClient.get('BallDir')
            ballx = dataFromClient.get('ballx')
            bally = dataFromClient.get('bally')
            paddle1 = dataFromClient.get('paddle1')
            paddle2 = dataFromClient.get('paddle2')
            if dataFromClient.get('move') == "W":
                paddle1 -= 20
            elif dataFromClient.get('move') == "S":
                paddle1 += 20
            elif dataFromClient.get('move') == "UP":
                paddle2 -= 20
            elif dataFromClient.get('move') == "DOWN":
                paddle2 += 20
            elif dataFromClient.get('move') == "BALL":
                if BallRoute == "UP":
                    if bally - self.randomAdd >= 10:
                        bally -= self.randomAdd
                    else:
                        BallRoute = "DOWN"
                elif BallRoute == "DOWN":
                    if bally + self.randomAdd <= 290:
                        bally += self.randomAdd
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
                        self.randomAdd = random.choice([1, 2])
                elif (BallDirection == "RIGHT"):
                    ballx += 5
                    if ballx == 570 and bally + 10 >= paddle2 and bally - 10 <= paddle2 + 50:
                        if (bally < paddle2 + 25):
                            BallRoute = "UP"
                        elif (bally > paddle2 + 25):
                            BallRoute = "DOWN"
                        BallDirection = "LEFT"
                        self.randomAdd = random.choice([1, 2])
            tofront = {
                'MoveFor': dataFromClient.get('WhatIGiveYou'),
                'paddle1': paddle1,
                'paddle2': paddle2,
                'Ballx': ballx, 'Bally' :bally,
                'BallDir': BallDirection, 'BallRoute': BallRoute,
            }
            try:
                await self.send_json(tofront)
                # await sleep(1)
            except:
                print("Can't Send Data")
        elif dataFromClient.get('gameStatus') == "End":
            await self.disconnect(1000)
    async def disconnect(self, code):
        print(f"Local Game End")
        await self.close(code)


#Need To Hundle Tournement
class pongTourServer(AsyncJsonWebsocketConsumer):
    TheWinners = list()
    tournementGroups = list(dict())
    playersOnMatchAndItsRoomId = dict()
    playersOnMatchAndItsOppenent = dict()
    playersOnMatchAndItsDeriction = dict()
    
    async def connect(self):
        print(f"[-----{self.scope['user']} Try To Connect On Tournement Server].------")
        if self.playersOnMatchAndItsDeriction.get(self.scope['user']) is not None:
            print(f"{self.scope['user']} Already In Another Game")
            self.scope['user'] = "Bad One"
            await self.accept()
            await self.close()
            return
        if len(self.tournementGroups) == 0:
            print(f"{self.scope['user']} Is The First One Joined To This Tour")
            self.tournementGroups.append({'name': self.scope['user'], 'channel_name': self.channel_name})
        elif len(self.tournementGroups) < 4:
            for i in self.tournementGroups:
                if i.get('name') == self.scope['user']:
                    self.scope['user'] = "Bad One"
                    await self.accept()
                    await self.close()
                    return
            print(f"{self.scope['user']} Will Joined To This List Of Players:")
            print(f"-> {self.tournementGroups}")
            self.tournementGroups.append({'name': self.scope['user'], 'channel_name': self.channel_name})
            if len(self.tournementGroups) == 4:
                player1 = self.tournementGroups[0].get('name')
                player2 = self.tournementGroups[1].get('name')
                player3 = self.tournementGroups[2].get('name')
                player4 = self.tournementGroups[3].get('name')
                print("---------------------- Players On Tour ---------------------")
                print(player1)
                print(player2)
                print(player3)
                print(player4)
                self.playersOnMatchAndItsRoomId[player1] = pongGameInfo.objects.get(login=player1).codeToPlay
                self.playersOnMatchAndItsRoomId[player3] = pongGameInfo.objects.get(login=player1).codeToPlay
                self.playersOnMatchAndItsOppenent[player1] = player3
                self.playersOnMatchAndItsOppenent[player3] = player1
                self.playersOnMatchAndItsDeriction[player1] = "Left"
                self.playersOnMatchAndItsDeriction[player3]  = "Right"
                await self.channel_layer.group_add(self.playersOnMatchAndItsRoomId.get(player1),
                                             self.tournementGroups[0].get('channel_name'))
                await self.channel_layer.group_add(self.playersOnMatchAndItsRoomId.get(player1),
                                             self.tournementGroups[2].get('channel_name'))
                self.playersOnMatchAndItsRoomId[player2] = pongGameInfo.objects.get(login=player2).codeToPlay
                self.playersOnMatchAndItsRoomId[player4] = pongGameInfo.objects.get(login=player2).codeToPlay
                self.playersOnMatchAndItsOppenent[player2] = player4
                self.playersOnMatchAndItsOppenent[player4] = player2
                self.playersOnMatchAndItsDeriction[player2] = "Left"
                self.playersOnMatchAndItsDeriction[player4]  = "Right"
                await self.channel_layer.group_add(self.playersOnMatchAndItsRoomId.get(player2),
                                             self.tournementGroups[1].get('channel_name'))
                await self.channel_layer.group_add(self.playersOnMatchAndItsRoomId.get(player2),
                                             self.tournementGroups[3].get('channel_name'))
        await self.accept()
        if len(self.tournementGroups) == 4:
            self.tournementGroups.clear()
            try:
                toFront1 = {'player1': player1, 'player2': player3, 'roomid': self.playersOnMatchAndItsRoomId.get(player1)}
                toFront2 = {'player1': player2, 'player2': player4, 'roomid': self.playersOnMatchAndItsRoomId.get(player2)}
                await self.channel_layer.group_send(self.playersOnMatchAndItsRoomId.get(player1),
                        {'type': 'ToFrontOnConnect', 'Data': toFront1})
                await self.channel_layer.group_send(self.playersOnMatchAndItsRoomId.get(player2),
                        {'type': 'ToFrontOnConnect', 'Data': toFront2})
            except:
                pass

    async def receive_json(self, dataFromClient, bytes_data=None):
        try:
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
                        ballx -= 2
                        if ballx == 30 and bally + 10 >= paddle1 and bally - 10 <= paddle1 + 50:
                            if (bally < paddle1 + 25):
                                BallRoute = "UP"
                            elif (bally > paddle1 + 25):
                                BallRoute = "DOWN"
                            BallDirection = "RIGHT"
                    elif (BallDirection == "RIGHT"):
                        ballx += 2
                        if ballx == 570 and bally + 10 >= paddle2 and bally - 10 <= paddle2 + 50:
                            if (bally < paddle2 + 25):
                                BallRoute = "UP"
                            elif (bally > paddle2 + 25):
                                BallRoute = "DOWN"
                            BallDirection = "LEFT"
                toFront = {
                        'Round': 'SemiFinal',
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
                    await self.channel_layer.group_send(roomidForThisUser, {'type': 'endGame', 'Data': "EMPTY"})
                else:
                    try:
                        self.tournementGroups.remove(thisUser)
                        print(f"{thisUser} Left Without Playing")
                        await self.close()
                    except:
                        print(f"{thisUser} Not In The Q At All")
            elif dataFromClient.get('gameStatus') == "End":
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
                self.TheWinners.append(winner)
                print(f"Added To Winners List: {winner}")
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
                    toFront = {
                        'Round': 'Final',
                        'Winner': winner,
                        'Loser': loser,
                    }
                    await self.channel_layer.group_send(roomId, {'type': 'FinalRound', 'Data': toFront})
                except:
                    print(f"{thisUser} Already End And This Match Counted")
            elif dataFromClient.get('gameStatus') == "NextRound":
                if self.scope['user'] in self.TheWinners:
                    await self.send_json({'Round': "FinalRound"})
                else:
                    await self.send_json({'Round': "NoRound"})
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
                            self.playersOnMatchAndItsRoomId, self.playersOnMatchAndItsDeriction,
                            player1, player2)
            if roomidForThisUser is not None:
                await self.channel_layer.group_discard(roomidForThisUser, self.channel_name)
                print("Channel Discard")
        except:
            pass

    async def ToFrontOnConnect(self, data):
        # print("Sending Data To Clinet...")
        await self.send_json(data['Data'])
    
    async def FinalRound(self, data):
        await self.send_json(data['Data'])

class Finalist(AsyncJsonWebsocketConsumer):
    async def connect(self):
        
        await self.accept()
    async def receive(self, text_data=None, bytes_data=None):
        print(f"Clinet: {self.scope['user']}\nData: {text_data}")
    async def disconnect(self, code):
        await self.close()
        
        
        
#  Motherhugger ostora
import json
import random
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio

class TournamentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("MOTHER HUGGER OSTORRA")
        await self.accept()
        self.players = []
        self.matchups = []
        self.winners = []
        self.losers = []
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
        print(f"data: {data}")
        action = data.get('action')

        if action == 'submit_players':
            self.players = data.get('players')
            random.shuffle(self.players)
            self.matchups = [
                (self.players[0], self.players[1]),
                (self.players[2], self.players[3])
            ]
            await self.send(text_data=json.dumps({
                'status': 'success',
                'matchups': self.matchups,
            }))

        elif action == 'start_tournament':
            self.current_stage = "semi_finals"
            self.current_match = 0
            self.winners = []
            self.losers = []
            await self.start_next_match()

        elif action == 'paddle_movement':
            self.handle_paddle_movement(data.get('player'), data.get('direction'))

    def handle_paddle_movement(self, player, direction):
        # Slow down the paddle movement by reducing the step size
        step_size = 2  # Adjust this value to control the paddle speed
        if player == 'player1':
            print(f"player: {player} directiom: {direction}")
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
                player1, player2 = self.matchups[self.current_match]
                self.reset_game_state(player1, player2)
                await self.send(text_data=json.dumps({
                    'status': 'start_match',
                    'player1': player1,
                    'player2': player2,
                }))
                self.current_game_loop_task = asyncio.create_task(self.run_game_loop())
            else:
                # After semi-finals, set up the 3rd place and final matches
                self.current_stage = "finals"
                self.current_match = 0
                self.matchups = [
                    (self.losers[0], self.losers[1]),  # Third-place match
                    (self.winners[0], self.winners[1])  # Final match
                ]
                await self.start_next_match()
        elif self.current_stage == "finals":
            if self.current_match < len(self.matchups):
                player1, player2 = self.matchups[self.current_match]
                self.reset_game_state(player1, player2)
                await self.send(text_data=json.dumps({
                    'status': 'start_match',
                    'player1': player1,
                    'player2': player2,
                }))
                self.current_game_loop_task = asyncio.create_task(self.run_game_loop())
            else:
                tournament_winner = self.winners[-1]
                await self.send(text_data=json.dumps({
                    'status': 'tournament_complete',
                    'winner': tournament_winner,
                    'semi_final_results': self.matchups[:2],
                    'third_place_result': self.matchups[0],
                    'final_result': self.matchups[1],
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
                    self.game_state['ballSpeedY'] += deltaY * 0.09  # Slight variation in speed based on hit point
                else:
                    self.game_state['score2'] += 1
                    self.reset_ball()

            elif self.game_state['ballX'] + 10 >= 800 - 10:  # Right paddle (Player 2)
                if self.game_state['paddle2Y'] < self.game_state['ballY'] < self.game_state['paddle2Y'] + 75:
                    self.game_state['ballSpeedX'] = -self.game_state['ballSpeedX']
                    deltaY = self.game_state['ballY'] - (self.game_state['paddle2Y'] + 75 / 2)
                    self.game_state['ballSpeedY'] += deltaY * 0.09  # Slight variation in speed based on hit point
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

        if self.current_stage == "semi_finals":
            self.winners.append(winner)
            loser = self.matchups[self.current_match][0] if winner != self.matchups[self.current_match][0] else self.matchups[self.current_match][1]
            self.losers.append(loser)

        elif self.current_stage == "finals":
            if self.current_match == 0:  # Third place match
                self.losers.append(winner)
            else:  # Final match
                self.winners.append(winner)

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

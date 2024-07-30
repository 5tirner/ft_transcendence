from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import pongGameInfo, pongHistory
import os
from .destroyGameInfo import destroyThisGameInformations
from .generateCode import roomcode

os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

class myPongserver(AsyncJsonWebsocketConsumer):
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
                toFronEnd = {'player1': player1, 'player2': player2, 'roomid': roomid}
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
            thisUser = self.scope['user']
            oppenent = self.playersOnMatchAndItsOppenent.get(self.scope['user'])
            roomidForThisUser = self.playersOnMatchAndItsRoomId.get(thisUser)
            # dataFromClient = text_data
            if dataFromClient.get('gameStatus') == "onprogress":
                BallRoute = dataFromClient.get('BallRoute')
                BallDirection = dataFromClient.get('BallDir')
                ballx = dataFromClient.get('ballx')
                bally = dataFromClient.get('bally')
                paddle1 = dataFromClient.get('paddle1')
                paddle2 = dataFromClient.get('paddle2') 
                if dataFromClient.get('move') == "UP":
                    if self.playersOnMatchAndItsRoomId.get(thisUser) == pongGameInfo.objects.get(login=thisUser).codeToPlay:
                        paddle1 -= 10
                    else:
                        paddle2 -= 10
                elif dataFromClient.get('move') == "DOWN":
                    if self.playersOnMatchAndItsRoomId.get(thisUser) == pongGameInfo.objects.get(login=thisUser).codeToPlay:
                        paddle1 += 10
                    else:
                        paddle2 += 10
                elif dataFromClient.get('move') == "BALL":
                    if BallRoute == "UP":
                        if bally - 1 >= 10:
                            bally -= 1
                        else:
                            BallRoute = "DOWN"
                    elif BallRoute == "DOWN":
                        if bally + 1 <= 290:
                            bally += 1
                        else:
                            BallRoute = "UP"
                    if (BallDirection == "LEFT"):
                        ballx -= 1
                        if ballx == 30 and bally + 10 >= paddle1 and bally - 10 <= paddle1 + 50:
                            # if (bally == paddle1 + 25):
                            #     BallRoute = "LINE"
                            if (bally < paddle1 + 25):
                                BallRoute = "UP"
                            elif (bally > paddle1 + 25):
                                BallRoute = "DOWN"
                            BallDirection = "RIGHT"
                            # ballx += 10
                    elif (BallDirection == "RIGHT"):
                        ballx += 1
                        if ballx == 770 and bally + 10 >= paddle2 and bally - 10 <= paddle2 + 50:
                            # if (bally == paddle2 + 25):
                            #     BallRoute = "LINE"
                            if (bally < paddle2 + 25):
                                BallRoute = "UP"
                            elif (bally > paddle2 + 25):
                                BallRoute = "DOWN"
                            BallDirection = "LEFT"
                            # ballx -= 10
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
                        self.playerWantsToPlay.remove(thisUser)
                        print(f"{thisUser} Left Without Playing")
                        roomId = pongGameInfo.objects.get(login=thisUser).codeToPlay
                        await self.channel_layer.group_discard(roomId, self.channel_name)
                        await self.close()
                    except:
                        print(f"{thisUser} Not In The Q At All")
            elif dataFromClient.get('gameStatus') == "End":
                print(f"Player Side {self.playersOnMatchAndItsDeriction.get(thisUser)}")
                print(f"Goal Side {dataFromClient.get('Side')}")
                if self.playersOnMatchAndItsDeriction.get(thisUser) == "Left" and dataFromClient.get('Side') == "LEFT":
                    loser = thisUser
                    winner = oppenent
                else:
                    winner = thisUser
                    loser = oppenent
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
                    await self.channel_layer.group_send(roomId, {'type': 'endGame', 'Data': 'EMPTY'})
                except:
                    print(f"{thisUser} Already End And This Match Counted")
        except:
            pass
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
        print(f"WebSocket Will Be Closed Client: {self.scope['user']}")
        await self.close()

class pongLocalServer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        print(f"{self.scope['user']} Try To Play Local Server")
        await self.accept()
    async def receive_json(self, dataFromClient, bytes_data=None):
        BallRoute = dataFromClient.get('BallRoute')
        BallDirection = dataFromClient.get('BallDir')
        ballx = dataFromClient.get('ballx')
        bally = dataFromClient.get('bally')
        paddle1 = dataFromClient.get('paddle1')
        paddle2 = dataFromClient.get('paddle2') 
        if dataFromClient.get('move') == "UP":
            print(dataFromClient)
            paddle1 -= 10
            print(f"UP From {dataFromClient.get('paddle1')} To {paddle1}")
        elif dataFromClient.get('move') == "DOWN":
            print(dataFromClient)
            paddle1 += 10
            print(f"DOWN From {dataFromClient.get('paddle1')} To {paddle1}")
        elif dataFromClient.get('move') == "W":
            print(dataFromClient)
            paddle2 -= 10
            print(f"W From {dataFromClient.get('paddle2')} To {paddle2}")
        elif dataFromClient.get('move') == "S":
            print(dataFromClient)
            paddle2 += 10
            print(f"S From {dataFromClient.get('paddle2')} To {paddle2}")
        tofront = {
            'MoveFor': dataFromClient.get('WhatIGiveYou'),
            'paddle1': paddle1,
            'paddle2': paddle2,
            'Ballx': ballx, 'Bally' :bally,
            'BallDir': BallDirection, 'BallRoute': BallRoute,
        }
        await self.send_json(tofront)
    async def disconnect(self, code):
        print(f"Local Game End")
        await self.close()




#Need To Hundle Tournement
class pongTourServer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        print(f"{self.scope['user']} Try To Connect On Tournement Server")
        await self.accept()
    async def receive(self, text_data, bytes_data=None):
        pass
    async def disconnect(self, code):
        pass

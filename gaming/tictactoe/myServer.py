from channels.generic.websocket import AsyncWebsocketConsumer
import random
import string
import json
from django.shortcuts import render, redirect
from .pars import isGoodClick, setEndGame
from .models import players

class myServer(AsyncWebsocketConsumer):
    async def connect(self):
        print('\n****************************************\n')
        print("On Connecting:\n")
        print("Client Just Appearing Here")
        print(f"URLROUTE = {self.scope['url_route']}")
        # self.roomcode_group = str(''.join(random.choices(string.ascii_uppercase + string.digits, k = 30)))
        # self.roomcode = self.scope['url_route']['kwargs'].get('roomcode')
        self.roomcode_group = self.scope['url_route']['kwargs'].get('roomcode')
        print(f"RoomPrivateCode: {self.roomcode_group}")
        await self.channel_layer.group_add(self.roomcode_group, self.channel_name)
        print(f"Channel Name Of This Client: {self.channel_name}")
        tmp = players.objects.filter(roomcode=self.roomcode_group).first()
        if tmp is not None:
            tmp.channel = 'X'
            tmp.save()
        await self.accept()
        print("Client Accepted Succefully")
        print("******************************************\n")
    
    async def receive(self, text_data, bytes_data=None):
        print(f"Data Come :{text_data} Type: {type(text_data)}")
        data = json.loads(text_data)
        print(f"Player {data.get('player')} Click On Square {data.get('element')} Using {data.get('symbol')}")
        checker = await isGoodClick(data.get('element'), data.get('player'), data.get('symbol'))
        print(f"The Checker = {checker}")
        if checker == -1:
            await self.channel_layer.group_send(
            self.roomcode_group,
            {
                'type': "BadClick",
                'error': "BAD",
            },
            )
        elif checker == 0:
            await self.channel_layer.group_send(
                self.roomcode_group,
                {
                    'type': "run_game",
                    'payload': data,
                },
                )
        else:
            await self.channel_layer.group_send(
            self.roomcode_group,
            {
                'type': "GameOver",
                'payload': data,
            },
            )
    
    async def run_game(self, event):
        print(f"Event Content: {event}")
        data = event['payload']
        symbol = ""
        if (data.get('symbol') == 1):
            symbol = "squareX"
        elif data.get('symbol') == 2:
            symbol = "squareO"
        toFronEnd = json.dumps({'Player': data.get('player'), 'Image': symbol, 'pos': data.get('element'), 'gameStatus': 0})
        await self.send(toFronEnd)

    async def BadClick(self, event):
        await self.send(event['error'])

    async def GameOver(self, event):
        print(f"ENDING...")
        data = event['payload']
        data['gameStatus'] = int(1)
        await setEndGame(data.get('player'), data.get('symbol'))
        symbol = ""
        if (data.get('symbol') == 1):
            symbol = "squareX"
        elif data.get('symbol') == 2:
            symbol = "squareO"
        toFronEnd = json.dumps({'Player': data.get('player'), 'Image': symbol, 'pos': data.get('element'), 'gameStatus': 1})
        await self.send(toFronEnd)

    async def disconnect(self, code_status):
        print(f"Client Of ChannelLayer {self.channel_name} Close Connection")
        await self.channel_layer.group_discard(self.roomcode_group, self.channel_name)
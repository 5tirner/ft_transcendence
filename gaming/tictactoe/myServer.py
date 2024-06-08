from channels.generic.websocket import AsyncWebsocketConsumer
import random
import string
import json

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
        await self.accept()
        print("Client Accepted Succefully")
        print("******************************************\n")
    
    async def receive(self, text_data, bytes_data=None):
        print(f"Data Come :{text_data}")
        await self.channel_layer.group_send(
            self.roomcode_group,
            {
                'type': "run_game",
                'payload': text_data,
            },
            )
    
    async def run_game(self, event):
        data = event['payload']
        # data = json.loads(data)
        # await self.send(text_data = json.dumps({
        #     'payload': data['data']
        # }))
    async def disconnect(self, code_status):
        print(f"Client Of ChannelLayer {self.channel_name} Close Connection")
        await self.channel_layer.group_discard(self.roomcode_group, self.channel_name)
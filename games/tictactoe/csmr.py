import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import tttgame

class play(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print("Connection Accepted Succefully")
        # self.room_name = self.scope['ulr_route']['kwargs']['room_id']
        # self.room_group_name = 'room_%s' % self.room_name
        # print(self.room_name, '---', self.room_group_name)
    async def disconnect(self, close_code):
        print("Disconnected")
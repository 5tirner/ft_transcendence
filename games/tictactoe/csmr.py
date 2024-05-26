import json
from channels.generic.websocket import AsyncWebsocketConsumer

class play(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['ulr_route']['kwargs']['room_id']
        self.room_group_name = 'room_%s' % self.room_name
        print(self.room_name, '---', self.room_group_name)
    async def disconnect():
        print("Disconnected")
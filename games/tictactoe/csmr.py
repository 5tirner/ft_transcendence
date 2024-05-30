import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import tttgame

class play(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print("Connection Accepted Succefully")
    async def receive(self, text_data=None, bytes_data=None):
        print("---------------------------------")
        print(f"text data = {text_data}")
        print("---------------------------------")
    async def disconnect(self, close_code):
        print("Disconnected")
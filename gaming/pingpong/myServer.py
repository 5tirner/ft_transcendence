from channels.generic.websocket import AsyncWebsocketConsumer
import random
import string
import json

class myServer(AsyncWebsocketConsumer):

    async def connect(self):
        pass

    async def receive(self, text_data, bytes_data=None):
        pass

    async def disconnect(self, code):
        pass
from channels.generic.websocket import AsyncWebsocketConsumer
import time

class PingPongServer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        roomcode = self.scope['url_route']['kwargs'].get('roomcode')
        print(f"Room Code For This Channel Is: {roomcode}")
    async def receive(self, text_data, bytes_data=None):
        save = int(text_data) + 1
        #await self.send(str(save))
        #time.sleep(2)
    async def disconnect(self, code):
        print(f"Clinet Of Channel  Disconnected")
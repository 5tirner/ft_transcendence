from channels.generic.websocket import AsyncWebsocketConsumer

class myPongserver(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def receive(self, text_data, bytes_data=None):
        print(f"Data Received From Clinet:\n{text_data}")

    async def disconnect(self, code):
        print(f"User Lost Connection")

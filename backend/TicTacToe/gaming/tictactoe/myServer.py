from channels.generic.websocket import AsyncWebsocketConsumer

class myServerOnLobby(AsyncWebsocketConsumer):
    async def connect(self):
        print(f'User On Lobby Is: {self.scope["user"]}')
        await self.accept()
    async def receive(self, text_data, bytes_data=0):
        pass
    async def disconnect(self, code):
        pass
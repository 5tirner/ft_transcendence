from channels.generic.websocket import AsyncWebsocketConsumer

class myServer(AsyncWebsocketConsumer):
    async def connect(self):
        print("Client Just Appearing Here")
        print(f"Channels Layer For This Client: {self.channel_layer}")
        await self.accept()
        print("Client Accepted Succefully")
    
    async def receive(self, text_data, bytes_data=None):
        print(f"Data Come From The Client Of ChannelLayer {self.channel_layer}-> {text_data}")
        await self.send("Data Received Succesfully")
    
    async def disconnect(self, close_code):
        print(f"Client Of ChannelLayer {self.channel_layer} Close Connection")
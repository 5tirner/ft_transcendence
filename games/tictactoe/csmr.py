import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import tttgame
import threading

def fetch(user):
    if tttgame.objects.filter(game_creator=user).first() is not None:
        print("Creator Joined...")
    elif tttgame.objects.filter(game_oppenent=user).first() is not None:
        print("Oppenet Joined...")
    else:
        print("None")

class play(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print("---------------------------------")
        print(f'path:\n{self.scope["path"]}')
        print(f'Headers:\n{self.scope["headers"]}')
        # print(self.scope["method"])
        print("Connection Accepted Succefully")
        print("---------------------------------")

    async def receive(self, text_data=None, bytes_data=None):
        print("---------------------------------")
        print(f"text data = {text_data}")
        t1 = threading.Thread(target=fetch, args=(text_data,))
        t1.start()
        t1.join()
        print("---------------------------------")
    async def disconnect(self, close_code):
        print("Disconnected")
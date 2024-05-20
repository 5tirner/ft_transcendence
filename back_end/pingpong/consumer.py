from channels.generic.websocket import WebsocketConsumer
import json
from time import sleep
from random import randint

class numbers(WebsocketConsumer):
    def connect(self):
        self.accept()
        for i in range(30):
            self.send(json.dumps({'nbr': randint(1, 1000)}))
            sleep(2)

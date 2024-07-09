from django.urls import path
from .myServer import myServerOnGame, myServerOnLobby

wsurl = [
    path('games/', myServerOnLobby.as_asgi()),
    path('games/ttt/<roomcode>', myServerOnGame.as_asgi()),
]
from django.urls import path
from .myServer import myServerOnLobby

wsurl = [
    path('TicTacToeWs/', myServerOnLobby.as_asgi()),
]
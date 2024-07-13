from django.urls import path
from .myServer import myServerOnLobby

wsurl = [
    path('games/', myServerOnLobby.as_asgi()),
]
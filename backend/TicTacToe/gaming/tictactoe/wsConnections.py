from django.urls import path
from .myServer import myServerOnLobby

wsurl = [
    path('LobbyWS/', myServerOnLobby.as_asgi()),
]
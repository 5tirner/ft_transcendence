from django.urls import path
from .myServer import myServerOnLobby, myServerOnGame

wsurl = [
    path('LobbyWS/', myServerOnLobby.as_asgi()),
    path('GameWS/', myServerOnGame.as_asgi()),
]
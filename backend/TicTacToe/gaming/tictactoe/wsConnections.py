from django.urls import path
from .myServer import myServer

wsurl = [
    path('games/ttt/<roomcode>', myServer.as_asgi()),
]
from django.urls import path
from .myServer import myServer

wsurl = [
    path('tictactoe/<roomcode>', myServer.as_asgi()),
]
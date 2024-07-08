from django.urls import path
from .myServer import PingPongServer

wsPattern = [
    path('pingpong/<roomcode>', PingPongServer.as_asgi()),
]
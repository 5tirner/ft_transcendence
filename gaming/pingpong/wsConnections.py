from django.urls import path
from .myServer import myServer

wsPattern = [
    path('pingpong/<roomcode>', myServer.as_asgi()),
]
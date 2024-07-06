from django.urls import path
from .myServer import myServer

wsurl = [
    path('ttt/<roomcode>', myServer.as_asgi()),
]
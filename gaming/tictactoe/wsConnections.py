from django.urls import path
from .myServer import myServer

wsurl = [
    path('gaming/<roomcode>', myServer.as_asgi()),
]
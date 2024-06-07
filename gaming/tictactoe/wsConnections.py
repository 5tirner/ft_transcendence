from django.urls import path
from .myServer import myServer

wsurl = [
    path('gaming', myServer.as_asgi()),
]
from django.urls import path
from .myServer import myPongserver, pongTourServer

wsPatterns = [
    path('PongGameWs/', myPongserver.as_asgi()),
    path('PongTourWs/', pongTourServer.as_asgi()),
]
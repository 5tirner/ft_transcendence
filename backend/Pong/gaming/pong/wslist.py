from django.urls import path
from .myServer import myPongserver, pongTourServer, pongLocalServer

wsPatterns = [
    path('PongGameWs/', myPongserver.as_asgi()),
    path('PongTourWs/', pongTourServer.as_asgi()),
    path('localGameWs/', pongLocalServer.as_asgi()),
]
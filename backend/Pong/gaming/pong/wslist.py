from django.urls import path
from .myServer import myPongserver

wsPatterns = [
    path('PongGameWs/', myPongserver.as_asgi())
]
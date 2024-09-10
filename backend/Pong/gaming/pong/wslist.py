from django.urls import path
from .myServer import myPongserver, pongTourServer, pongLocalServer, Finalist, freindReqPong, TournamentConsumer

wsPatterns = [
    path('PongGameWs/', myPongserver.as_asgi()),
    path('PongTourWs/', pongTourServer.as_asgi()),
    path('localGameWs/', pongLocalServer.as_asgi()),
    path('finalPongTour/', Finalist.as_asgi()),
    path('GameInvite/<roomdcode>', freindReqPong.as_asgi()),
    path('Tournaments/', TournamentConsumer.as_asgi()),
]

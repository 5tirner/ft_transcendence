from django.urls import path
from .csmr import play

wsurls = [
    path('ws/game/<room_id>', play.as_asgi()),
]
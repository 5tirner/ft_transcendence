from django.urls import path
from .views import welcome, game

urlpatterns = [
    path('', welcome, name="Welcoming Page"),
    path('tictactoe/<room_id>', game, name="Gaming"),
]
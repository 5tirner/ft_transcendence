from django.urls import path
from .views import game, home

urlpatterns = [
    path('tictactoe', home, name="homePage"),
    path('tictactoe/<roomcode>', game, name="tictactoe")
]
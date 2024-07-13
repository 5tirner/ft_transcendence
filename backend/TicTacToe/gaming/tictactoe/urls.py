from django.urls import path
from .views import game, statistics

urlpatterns = [
    path('MyStatistics/', statistics, name="homePage"),
    path('TicTacToe/', game, name="tictactoe")
]
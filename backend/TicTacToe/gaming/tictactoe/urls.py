from django.urls import path
from .views import game, myProfile, userStatistic, TicTacToeLobby

urlpatterns = [
    path('myProfile/', myProfile, name="homePage"),
    path('UserStat/<login>/', userStatistic),
    path('Game/', game, name="tictactoe"),
    path('Lobby/', TicTacToeLobby),
]
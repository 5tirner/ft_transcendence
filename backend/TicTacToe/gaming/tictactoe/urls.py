from django.urls import path
from .views import game, myProfile, userStatistic

urlpatterns = [
    path('', game),
    path('myProfile/', myProfile, name="homePage"),
    path('UserStat/<login>/', userStatistic),
    path('Game/', game, name="tictactoe"),
    # path('Lobby/', TicTacToeLobby),
    # path('History/', historic),
]
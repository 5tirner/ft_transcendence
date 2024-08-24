from django.urls import path
from .views import myProfile, userStatistic, historic

urlpatterns = [
    # path('', game),
    path('myProfile/', myProfile, name="homePage"),
    path('UserStat/<login>/', userStatistic),
    # path('Game/', game, name="tictactoe"),
    # path('Lobby/', TicTacToeLobby),
    path('History/', historic),
]
from django.urls import path
from .views import myProfile, historic, updateInfoTTT, updateImageTTT

urlpatterns = [
    # path('', game),
    path('myProfile/', myProfile, name="homePage"),
    path('UpdateImageTTT/', updateImageTTT),
    # path('UserStat/<login>/', userStatistic),
    # path('Game/', game, name="tictactoe"),
    # path('Lobby/', TicTacToeLobby),
    path('History/', historic),
    path('UpdateGameInfo/', updateInfoTTT),
]
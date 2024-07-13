from django.urls import path
from .views import game, statistics, userStatistic

urlpatterns = [
    path('MyStatistics/', statistics, name="homePage"),
    path('UserStat/<login>/', userStatistic),
    path('TicTacToe/', game, name="tictactoe")
]
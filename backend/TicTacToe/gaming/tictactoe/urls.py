from django.urls import path
from .views import game, statistics

urlpatterns = [
    path('', statistics, name="homePage"),
    path('ttt/<roomcode>', game, name="tictactoe")
]
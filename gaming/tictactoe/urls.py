from django.urls import path
from .views import game, home

urlpatterns = [
    path('', home, name="homePage"),
    path('ttt/<roomcode>', game, name="tictactoe")
]
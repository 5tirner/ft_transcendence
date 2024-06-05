from django.urls import path
from .views import game, home

urlpatterns = [
    path('', home, name="homePage"),
    path('gaming/', game, name="tictactoe")
]
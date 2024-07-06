from django.urls import path
from .views import home, play
urlpatterns = [
    path('', home, name="LunchPage"),
    path('pingpong/<roomcode>', play, name="PingPong"),
]
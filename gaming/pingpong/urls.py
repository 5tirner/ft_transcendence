from django.urls import path
from .views import home1, game1

urlpatterns = [
    path('pingpong', home1, name="homePage"),
    path('pingpong/<roomcode>', game1, name="pingpong")
]
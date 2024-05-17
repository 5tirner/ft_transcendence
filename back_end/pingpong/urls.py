from django.urls import path
from . import views
urlpatterns = [
    path('pingpong/', views.start, name="PingPong"),
    path('', views.welcome, name="Welcome Page"),
]
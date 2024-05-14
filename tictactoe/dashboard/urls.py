from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard, name="dash"),
    path('', views.welcome, name="start")
]
from django.urls import path
from . import views
urlpatterns = [
    path('pingpong/', views.start, name="PingPong"),
    path('', views.welcome, name="Welcome Page"),
    path('pingpong/show/<int:id>', views.details, name="User Details"),
]
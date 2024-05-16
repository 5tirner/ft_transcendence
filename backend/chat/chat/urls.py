from django.urls import path
from . import views

urlpatterns = [
    path("", views.GetAllConversations.as_view()),
    path("<int:pk>/", views.GetRoomMessages.as_view()),
]

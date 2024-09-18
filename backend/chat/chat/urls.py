from django.urls import path
from . import views

urlpatterns = [
    path("", views.GetAllConversations.as_view()),
    path("<int:pk>/", views.GetRoomMessages.as_view()),
    path("read/<int:pk>/", views.RoomMessagesReaded.as_view()),
    path("create/", views.CreateConversation.as_view()),
    path("create/msg/", views.SubmitMessage.as_view()),
    path("delete/<int:user_id>/", views.DeleteConversation.as_view()),
]

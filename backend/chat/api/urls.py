from django.urls import include, path
from . import views

urlpatterns = [
    path("auth/login/", views.MyObtainAuthToken.as_view()),
    path("auth/register/", views.UserRegistrationAPIView.as_view()),
    path("auth/user/", views.UserDetailsAPIView.as_view()),
    path("chatrooms/", include("chat.urls")),
]

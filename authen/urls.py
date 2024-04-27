from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    # path('login/', views.user_login, name='login'),
    path('login/', views.login, name='login'),
    path('signup/', views.user_signup, name='signup'),
    path('logout/', views.user_logout, name='logout'),
    # path('callback/', views.callback_42, name='callback'),
    # path('auth_42/', views.login_42, name='login42'),
]
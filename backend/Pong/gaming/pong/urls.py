from django.urls import path
from .views import myProfile, userInfos, PongGame

urlpatterns = [
    path('myProfile/', myProfile),
    path('userStat/<login>', userInfos),
    path('', PongGame), 
]
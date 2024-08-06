from django.urls import path
from .views import myProfile, userInfos, PongGame, historic, PongTournement

urlpatterns = [
    path('myProfile/', myProfile),
    path('userStat/<login>', userInfos),
    path('History/', historic),
    path('', PongGame),
    path('Tournement/', PongTournement),
    # path('local/', PongLocalGame),
]
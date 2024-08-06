from django.urls import path
from .views import myProfile, userInfos, historic, PongTournement, TournamentHistory


urlpatterns = [
    path('myProfile/', myProfile),
    path('userStat/<login>', userInfos),
    path('History/', historic),
    # path('', PongGame),
    path('Tournement/', PongTournement),
    path('TourHistory/', TournamentHistory),
    # path('local/', PongLocalGame),
]
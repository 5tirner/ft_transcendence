from django.urls import path
from .views import myProfile, userInfos, historic, PongTournement, FinalRound


urlpatterns = [
    path('myProfile/', myProfile),
    path('userStat/<login>', userInfos),
    path('History/', historic),
    # path('', PongGame),
    path('Tournement/', PongTournement),
    path('Final/', FinalRound),
    # path('TourHistory/', TournamentHistory),
    # path('local/', PongLocalGame),
]
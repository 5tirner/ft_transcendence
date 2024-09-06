from django.urls import path
from .views import myProfile, userInfos, historic, updateInfo, addPlayer


urlpatterns = [
    path('addPlayer/', addPlayer),
    path('myProfile/', myProfile),
    path('userStat/<login>', userInfos),
    path('History/', historic),
    # path('', PongGame),
    # path('Tournement/', PongTournement),
    # path('Final/', FinalRound),
    path('UpdateGameInfo/', updateInfo),
    # path('UpdateUserInfos/<login>')
    # path('TourHistory/', TournamentHistory),
    # path('local/', PongLocalGame),
]
from django.urls import path
from .views import myProfile, historic, updateInfo, updateImage


urlpatterns = [
    # path('addPlayer/', addPlayer),
    path('myProfile/', myProfile),
    # path('userStat/<login>', userInfos),
    path('History/', historic),
    # path('', PongGame),
    # path('Tournement/', PongTournement),
    # path('Final/', FinalRound),
    path('UpdateGameInfo/', updateInfo),
    path('updateGamePic/', updateImage),
    # path('UpdateUserInfos/<login>')
    # path('TourHistory/', TournamentHistory),
    # path('local/', PongLocalGame),
]
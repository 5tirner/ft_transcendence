from django.urls import path

# from .views import UserLogin, UserSignup, PlayerUploadAvatar, PlayerInfos, PlayerGameMatch, MatchesHistory, Match
from . import views, friends_management
from restauthe import settings
from django.conf.urls.static import static

urlpatterns = [
    path("login/", views.UserLogin.as_view(), name="api_login"),
    path("logout/", views.logout, name="api_logout"),
    path("signup/", views.UserSignup.as_view(), name="api_signup"),
    path("oauth/intra/", views.login42, name="login_42"),  #
    path("oauth/callback/", views.callback42, name="callback_42"),
    path("google/", views.login_google, name="googleView"),
    path("google/callback/", views.callback_google, name="googlebackview"),
    path("TFA/codeqr/", views.tfa_qrcode, name="two_factor_qrcode"),
    path("TFA/verify/", views.tfa_verification, name="two_factor_verify"),
    path("avatar/", views.PlayerUploadAvatar.as_view(), name="upload_avatar"),
    path("", views.PlayerInfos.as_view(), name="playerinfo"),
    path("matches/", views.MatchesHistory.as_view(), name="matcheHistory"),
    path("friendship/", views.FriendshipRelation.as_view(), name="friendships"),
    path("signups/", views.register_user, name="signup"),
    path("logins/", views.user_login, name="login"),
    path("logouts/", views.user_logout, name="logout"),
    path("usercheck/", views.check_user),
    path("players/", friends_management.ListAllUsersView.as_view()),
    path("players/block/", friends_management.BlockUserView.as_view()),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

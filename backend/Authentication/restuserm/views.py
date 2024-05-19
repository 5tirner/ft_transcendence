from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer
from django.shortcuts import redirect, render
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from .services import (
    create_player,
    jwt_generation,
    decode_google_id_token,
    jwt_required_cookie,
    tfa_code_check,
    tfa_qr_code,
)
from django.utils.http import urlencode
from .models import Player
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from requests_oauthlib import OAuth2Session
from rest_framework.permissions import AllowAny
from django.core.cache import cache
from qr_code.qrcode.maker import make_qr_code_image
from qr_code.qrcode.utils import QRCodeOptions
from django.utils.decorators import method_decorator
from django.core.files.storage import default_storage
from .serializers import PlayerSerializerInfo
from django.db.models import Q
import jwt
import json
import requests
import urllib.parse

# from rest_framework.permissions import IsAuthenticated
# from rest_framework_simplejwt.authentication import JWTAuthentication


# def login_view(request):
#     return render(request, 'login.html')


def home(request):
    username = request.GET.get("username")
    # player = request.user
    # print(request.user, flush=True) #Check the request content
    # print('aaaa')

    return render(request, "index.html", {"username": username})


# def login42(request):
#     oauth = OAuth2Session(settings.FORTYTWO_CLIENT_ID, redirect_uri=settings.FORTYTWO_REDIRECT_URI, scope='public')
#     authorization_url = oauth.authorization_url("https://api.intra.42.fr/oauth/authorize")

#     return redirect(authorization_url)


# @api_view(['GET'])
@api_view(["GET"])
@authentication_classes([])  # Remove all authentication classes
@permission_classes([AllowAny])  # Allow any permission
def login42(request):
    print(request.method)
    redirect_uri = urlencode({"redirect_uri": settings.FORTYTWO_REDIRECT_URI})
    authorization_url = f"https://api.intra.42.fr/oauth/authorize?client_id={settings.FORTYTWO_CLIENT_ID}&{redirect_uri}&response_type=code&scope=public"
    return redirect(authorization_url)


@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def callback42(request):
    code = request.GET.get("code")
    error_message = request.GET.get("error")
    if error_message is not None:
        return Response({"error": error_message, "statusCode": 401})
    if code is None:
        return Response({"error": "code is required", "statusCode": 401})
    if request.user.is_authenticated:
        return Response(
            {
                "message": "Already signed in",
                "statusCode": 200,
            }
        )
    if code:
        token_url = "https://api.intra.42.fr/oauth/token"
        payload = {
            "grant_type": "authorization_code",
            "client_id": settings.FORTYTWO_CLIENT_ID,
            "client_secret": settings.FORTYTWO_CLIENT_SECRET,
            "code": code,
            "redirect_uri": "http://127.0.0.1:8000/api/oauth/callback/",
            "scope": "public profile",
        }
        response = requests.post(token_url, data=payload)
        if response.status_code == 200:
            access_token = response.json()["access_token"]
            user_response = requests.get(
                "https://api.intra.42.fr/v2/me",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            if not user_response.ok:
                return Response(
                    {"detail": "No access token in the token response"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user_data = {
                "email": user_response.json()["email"],
                "username": user_response.json()["login"],
                "first_name": user_response.json()["first_name"],
                "last_name": user_response.json()["last_name"],
                "avatar": user_response.json()["image"]["link"],
            }
            player = create_player(user_data)
            if player is None:
                return redirect("https://127.0.0.1:8000/api/login/", permanent=True)
            jwt_token = jwt_generation(player.id, player.two_factor)
            response = redirect("http://127.0.0.1:5050", permanent=True)
            response.set_cookie(
                "jwt_token", value=jwt_token, httponly=True, secure=True
            )
            return response
        else:
            return Response(
                {"error": "Failed to obtain access token"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    else:
        return Response(
            {"error": "Authorization code missing"}, status=status.HTTP_400_BAD_REQUEST
        )


# @api_view(['GET'])
@api_view(["GET"])
@authentication_classes([])  # Remove all authentication classes
@permission_classes([AllowAny])
def login_google(request):
    SCOPES = [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "openid",
    ]
    params = {
        "response_type": "code",
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "scope": " ".join(SCOPES),
        "access_type": "offline",
        "include_granted_scopes": "true",
        "prompt": "select_account",
    }
    query_params = urlencode(params)
    GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/auth"
    google_authorization_url = f"{GOOGLE_AUTH_URL}?{query_params}"
    return redirect(google_authorization_url)


# @api_view(['GET'])
@api_view(["GET"])
@authentication_classes([])  # Remove all authentication classes
@permission_classes([AllowAny])
def callback_google(request):
    code = request.GET.get("code")
    error_message = request.GET.get("error")
    if error_message is not None:
        return Response({"error": error_message, "statusCode": 401})
    if code is None:
        return Response({"error": "code is required", "statusCode": 401})

    # Exchange the authorization code for an access token
    token_url = "https://oauth2.googleapis.com/token"
    payload = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    response = requests.post(token_url, data=payload)

    if response.status_code == 200:
        token_data = response.json()
        access_token = token_data.get("access_token")  # Check if 'access_token' exists
        if access_token is None:
            return Response({"error": "Invalid access token", "StatusCode": 401})

        # Retrieve user data from Google
        user_info_url = "https://www.googleapis.com/oauth2/v1/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}
        user_response = requests.get(user_info_url, headers=headers)

        if user_response.status_code == 200:
            # user_tokens = user_response.json()
            token = token_data.get("id_token")  # I edited this now
            if token is None:
                return Response({"error": "Invalid ID token", "StatusCode": 401})
            get_decoded_token = decode_google_id_token(token)
            player_data = {
                "email": get_decoded_token.get("email"),
                "username": get_decoded_token.get("name"),
                "first_name": get_decoded_token.get("given_name"),
                "last_name": get_decoded_token.get("family_name"),
                "avatar": get_decoded_token.get("picture"),
            }
            player = create_player(player_data)
            if player is None:
                return redirect("http://127.0.0.1:8000/login", permanent=True)

            jwt_token = jwt_generation(player.id, player.two_factor)
            response = redirect(
                f"http://127.0.0.1:8000/{'2fa' if player.two_factor else 'api/home'}/",
                permanent=True,
            )
            response.set_cookie(
                "jwt_token", value=jwt_token, httponly=True, secure=True
            )
            return response
        else:
            return Response(
                {"error": "Failed to retrieve user data"},
                status=user_response.status_code,
            )
    else:
        return Response(
            {"error": "Failed to obtain access token"}, status=response.status_code
        )


class UserLogin(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key})
        else:
            return Response(
                {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )


@api_view(["GET"])
@jwt_required_cookie
def logout(request):
    if request.token is None:
        return Response({"error": "Access token not found", "statusCode": 400})
    cache.set(request.token, True, timeout=None)
    response = redirect("http://127.0.0.1:8000/login/", permanent=True)
    response.delete_cookie("jwt_token")
    return response


@api_view(["POST"])
def tfa_verification(request):
    code = request.data.get("code")
    try:
        token_jwt = request.COOKIES.get("jwt_token")
        token_decode = jwt.decode(token_jwt, settings.SECRET_KEY, algorithms=["HS256"])
    except:
        return Response({"error": "Invalid Token", "statusCode": 401})
    id_player = token_decode["id"]
    tfa = token_decode["2fa"]
    if not tfa:
        if not tfa_code_check(id_player, code):
            return Response({"error": "2FA code is incorrect", "statusCode": 401})
        player = Player.objects.get(id=id_player)
        player.two_factor = True
        player.save()
        return Response(
            {"message": "The player has successfully verified", "statusCode": 200}
        )
    else:
        if not tfa_code_check(id_player, code):
            return Response({"error": "2FA code is incorrect", "statusCode": 401})
        token_jwt = jwt_generation(id_player, False)
        response = Response(
            {
                "message": "The player has successfully verified",
                "statusCode": 200,
                "redirected": True,
            }
        )
        response.set_cookie("jwt_token", value=token_jwt, httponly=True, secure=True)
        return response


class UserSignup(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")
        if not username or not password or not email:
            return Response(
                {"error": "Username, password, and email are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST
            )
        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=username, email=email, password=password
        )
        if user:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key})
        else:
            return Response(
                {"error": "Failed to create user"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@api_view(["GET"])
@jwt_required_cookie
def tfa_qrcode(request):
    token_jwt = request.COOKIES.get("jwt_token")
    token_decode = jwt.decode(token_jwt, settings.SECRET_KEY, algorithms=["HS256"])
    id_player = token_decode["id"]
    code_qr = tfa_qr_code(id_player)
    qr_image = make_qr_code_image(code_qr, QRCodeOptions(), True)
    return HttpResponse(qr_image, content="image/svg+xml")


class PlayerAvatarUpload(APIView):
    @method_decorator(jwt_required_cookie)
    def post(self, request):
        # try:
        id = request.decoded_token["id"]
        avatar_file = request.FILES["avatar"]

    # except:


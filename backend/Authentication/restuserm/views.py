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
from .services import (
    create_player,
    jwt_generation,
    decode_google_id_token,
    jwt_required_cookie,
    tfa_code_check,
    tfa_qr_code,
)
from django.utils.http import urlencode
from .models import Player, PlayerGameMatch, Match, Friendships
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
from django.core.files.base import ContentFile
from django.db.models import Q
import jwt, os
import json
import requests
import urllib.parse
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes


@api_view(["GET"])
@authentication_classes([])  # Remove all authentication classes
@permission_classes([AllowAny])  # Allow any permission
def login42(request):
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
            "redirect_uri": settings.FORTYTWO_REDIRECT_URI,
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
                return redirect(f"{settings.TRANSCE_HOST}/login/", permanent=True)
            jwt_token = jwt_generation(player.id, player.two_factor)
            response = redirect(
                settings.TRANSCE_HOST, permanent=True
            )  # Should add the 2FA in this redirection
            #  response = redirect(f"http://{settings.TRANSCE_HOST}/{'2fa' if player.two_factor else 'home'}/", permanent=True)
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
        access_token = token_data.get("access_token")
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
                "username": get_decoded_token.get("given_name"),
                "first_name": get_decoded_token.get("given_name"),
                "last_name": get_decoded_token.get("family_name"),
                "avatar": get_decoded_token.get("picture"),
            }
            player = create_player(player_data)
            if player is None:
                return redirect("http://127.0.0.1:8000/login", permanent=True)

            jwt_token = jwt_generation(player.id, player.two_factor)
            response = redirect(
                settings.TRANSCE_HOST,
                permanent=True,
                # f"http://127.0.0.1:8000/{'tfa' if player.two_factor else 'api/home'}/",
                # permanent=True,
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
@authentication_classes([])  # Remove all authentication classes
@permission_classes([AllowAny])
@jwt_required_cookie
def logout(request):
    print(dir(request))
    if request.token is None:
        return Response({"error": "Access token not found", "statusCode": 400})
    cache.set(request.token, True, timeout=None)
    response = redirect("http://127.0.0.1:8000/login/", permanent=True)
    response.delete_cookie("jwt_token")
    return response


@api_view(["POST"])
@authentication_classes([])  # Remove all authentication classes
@permission_classes([AllowAny])
@jwt_required_cookie
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
        print("SIGN UP ------------------------")
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
@authentication_classes([])  # Remove all authentication classes
@permission_classes([AllowAny])
@jwt_required_cookie
def tfa_qrcode(request):
    token_jwt = request.COOKIES.get("jwt_token")
    token_decode = jwt.decode(token_jwt, settings.SECRET_KEY, algorithms=["HS256"])
    id_player = token_decode["id"]
    code_qr = tfa_qr_code(id_player)
    qr_image = make_qr_code_image(code_qr, QRCodeOptions(), True)
    return HttpResponse(qr_image, content_type="image/svg+xml")


@authentication_classes([])  # Remove all authentication classes
@permission_classes([AllowAny])
class PlayerUploadAvatar(APIView):
    @method_decorator(jwt_required_cookie, name="post")
    def post(self, request):
        try:
            tokenid = request.COOKIES.get("jwt_token")
            if not tokenid:
                return Response({"error": "No token provided", "statusCode": 401})
            id = jwt.decode(tokenid, settings.SECRET_KEY, algorithms=["HS256"])["id"]
            avatar_file = request.FILES.get("avatar")
            print("req: ", request)
            print("ava: ", avatar_file)
            if not avatar_file:
                return Response(
                    {"error": "No file Provided"}, status=status.HTTP_400_BAD_REQUEST
                )
            filePath = os.path.join(settings.MEDIA_ROOT, avatar_file.name)
            default_storage.save(filePath, ContentFile(avatar_file.read()))
            url_file = urllib.parse.urljoin(
                settings.PUBLIC_PLAYER_URL,
                os.path.join(settings.MEDIA_URL, avatar_file.name),
            )
            player = Player.objects.get(id=id)
            player.avatar = url_file
            player.save()
            return Response(
                {"message": "Avatar has been updated successfully", "statusCode": 200}
            )
        except Player.DoesNotExist:
            return Response({"error": "User doesn't exist", "statusCode": 404})
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@authentication_classes([])  # Remove all authentication classes
@permission_classes([AllowAny])
class PlayerInfos(APIView):

    @method_decorator(jwt_required_cookie)
    def get(self, request):
        try:
            username = request.query_params.get("username")
            if username:
                player = Player.objects.filter(username=username)
                if not player.exists():
                    raise Player.DoesNotExist
                serializer = PlayerSerializerInfo(player, many=True)
                return Response(
                    {
                        "player": serializer.data,
                        "message": "User has been found successfully",
                        "status": 200,
                    }
                )
            token = request.token
            player = Player.objects.get(
                id=jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])["id"]
            )
            serializer = PlayerSerializerInfo(player)
            return Response({"player": serializer.data, "status": 200})
        except Player.DoesNotExist:
            return Response(
                {
                    "message": "User not found",
                    "status": 404,
                }
            )
        except Exception as e:
            return Response(
                {
                    "message": str(e),
                    "status": 500,
                }
            )

    @method_decorator(jwt_required_cookie)
    def post(self, request):
        try:
            change_check = False
            id = jwt.decode(request.token, settings.SECRET_KEY, algorithms=["HS256"])[
                "id"
            ]
            player_data = request.data.get("player")
            player_id = Player.objects.get(id=id)

            if "username" in player_data:
                username = player_data["username"].strip()
                if not username or len(username) > 8:
                    return Response(
                        {"error": "Invalid username"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                player_id.username = username
                change_check = True

            if "first_name" in player_data:
                first_name = player_data["first_name"].strip()
                if not first_name or len(first_name) > 8:
                    return Response(
                        {"error": "Invalid first name"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                player_id.first_name = first_name
                change_check = True

            if "last_name" in player_data:
                last_name = player_data["last_name"].strip()
                if not last_name or len(last_name) > 8:
                    return Response(
                        {"error": "Invalid last name"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                player_id.last_name = last_name
                change_check = True

            if "status" in player_data:
                status_value = player_data["status"]
                if status_value not in dict(Player.STATUS_CHOICES):
                    return Response(
                        {"error": "Invalid status. Must be 'OFF','ON', OR 'ING'"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                player_id.status = status_value
                change_check = True

            if "two_factor" in player_data and player_data["two_factor"] is False:
                player_id.two_factor = player_data["two_factor"]
                change_check = True

            player_id.save()
            print(player_id.two_factor)
            return Response({"message": "User updated successfully", "status": 200})

        except Player.DoesNotExist:
            return Response({"message": "User not found", "status": 404})
        except KeyError:
            return Response({"error": "Invalid request data", "status": 400})
        except Exception as e:
            return Response({"error": str(e), "status": 500})


@authentication_classes([])  # Remove all authentication classes
@permission_classes([AllowAny])
class MatchesHistory(APIView):
    @method_decorator(jwt_required_cookie)
    def get(self, request):
        try:
            player = Player.objects.get(
                id=jwt.decode(request.token, settings.SECRET_KEY, algorithms=["HS256"])[
                    "id"
                ]
            )
            matches = PlayerGameMatch.objects.filter(
                id_player=player, id_match__state="PLY"
            ).order_by("-id_match__id")[:8]
            data_matches = []
            for match in matches:
                players_match = []
                for player_match in match.id_match.playergamematch_set.all():
                    players_match.append(
                        {
                            "id": player_match.id_player.id,
                            "username": player_match.id_player.username,
                            "avatar": player_match.id_player.avatar,
                            "score": player_match.score,
                            "won": player_match.won,
                        }
                    )

                data_matches.append(
                    {
                        "id": match.id_match.id,
                        "game": match.id_match.game,
                        "players": players_match,
                    }
                )

            return Response({"matches": data_matches, "status": 200})
        except Player.DoesNotExist:
            return Response({"message": "User not found", "status": 404})
        except Exception as e:
            return {"error": str(e), "status": 500}


@authentication_classes([])  # Remove all authentication classes
@permission_classes([AllowAny])
class FriendshipRelation(APIView):

    @method_decorator(jwt_required_cookie)
    def get(self, request):
        id = jwt.decode(request.token, settings.SECRET_KEY, algorithms=["HS256"])["id"]
        try:
            get_type = request.query_params.get(
                "type"
            )  # query parameter to verfiy which type of frienships is it
            if get_type == "invites":
                friendships = Friendships.objects.filter(receiver=id, status="PEN")
                friendship_data = []
                for friendship in friendships:
                    friend = friendship.sender
                    friend_data = PlayerSerializerInfo(friend).data
                    friendship_data.append(friend_data)

                return Response({"friendships": friendship_data})

            elif get_type == "friends":
                friendships = Friendships.objects.filter(
                    Q(sender=id) | Q(receiver=id), status="ACP"
                )
                friendship_data = []
                for friendship in friendships:
                    friend = (
                        friendship.sender
                        if friendship.sender.id != id
                        else friendship.receiver
                    )
                    friend_data = PlayerSerializerInfo(friend).data
                    friendship_data.append(friend_data)

                return Response({"friendships": friendship_data})

            elif get_type == "requests":
                friendships = Friendships.objects.filter(sender=id, status="PEN")
                friendship_data = []
                for friendship in friendships:
                    friend = friendship.receiver
                    friend_data = PlayerSerializerInfo(friend).data
                    friendship_data.append(friend_data)

                return Response({"friendships": friendship_data})

            elif get_type == "blocks":
                friendships = Friendships.objects.filter(sender=id, status="BLK")
                friendship_data = []
                for friendship in friendships:
                    friend = friendship.receiver
                    friend_data = PlayerSerializerInfo(friend).data
                    friendship_data.append(friend_data)

                return Response({"friendships": friendship_data})

            else:
                return Response(
                    {"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            return Response({"error": str(e), "status": 500})

    @method_decorator(jwt_required_cookie)
    def post(self, request):
        id = jwt.decode(request.token, settings.SECRET_KEY, algorithms=["HS256"])["id"]
        try:
            id_sender = Player.objects.get(id=id)
            id_receiver = request.data.get(
                "id_target"
            )  # add id_target of the receiver player in the body
            if id_receiver == id:
                return Response(
                    {
                        "error": "You cannot send a friend request to yourself",
                        "status": 400,
                    }
                )

            receiver = Player.objects.get(id=id_receiver)
            if Friendships.objects.filter(sender=id_sender, receiver=receiver).exists():
                return Response(
                    {"message": "Friend request already sent", "status": 400}
                )

            elif Friendships.objects.filter(
                sender=receiver, receiver=id_sender
            ).exists():
                friendships = Friendships.objects.filter(
                    sender=receiver, receiver=id_sender
                )
                friendships.update(status="ACP")
                return Response(
                    {"message": "Friend request accepted successfully", "status": 200}
                )

            else:
                friendship = Friendships.objects.create(
                    sender=id_sender, receiver=receiver, status="PEN"
                )
                friendship.save()
                return Response(
                    {
                        "message": "Friend request has been sented successfully",
                        "status": 200,
                    }
                )

        except Player.DoesNotExist:
            return Response({"error": "User not found", "status": 404})
        except Exception as e:
            return Response({"error": str(e), "status": 500})

    @method_decorator(jwt_required_cookie)
    def delete(self, request):
        try:
            id_sender = jwt.decode(
                request.token, settings.SECRET_KEY, algorithms=["HS256"]
            )["id"]
            id_receiver = request.data.get(
                "id_target"
            )  # add id_target of the receiver player in the body
            receiver = Player.objects.get(id=id_receiver)
            sender = Player.objects.get(id=id_sender)
            # to check bidirectionary friendship request send between both players
            try:
                friendship = Friendships.objects.get(sender=sender, receiver=receiver)
            except Friendships.DoesNotExist:
                friendship = Friendships.objects.get(sender=receiver, receiver=sender)

            if friendship:
                friendship.delete()
                return Response(
                    {
                        "message": "Friendship relation has been deleted successfully",
                        "status": 204,
                    }
                )
            else:
                return Response({"message": "Friendship not found", "status": 404})

        except Exception as e:
            return Response({"error": str(e), "status": 500})


# Temporary SignUp/Login/Logout methods for Chat testing

from .serializers import UserSerializer


@api_view(["POST"])
@authentication_classes([])  # Remove all authentication classes
@permission_classes([AllowAny])
def register_user(request):
    if request.method == "POST":
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            jwt_token = jwt_generation(user.id, user.two_factor)
            response = Response(serializer.data, status=status.HTTP_201_CREATED)
            response.set_cookie(
                "jwt_token", value=jwt_token, httponly=True, secure=True
            )
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@authentication_classes([])  # Remove all authentication classes
@permission_classes([AllowAny])
def user_login(request):
    if request.method == "POST":
        username = request.data.get("username")
        password = request.data.get("password")

        print("-----------------------------------------")
        print(username, password)
        print("-----------------------------------------")
        user = None
        if "@" in username:
            try:
                user = Player.objects.get(email=username)
            except Player.DoesNotExist:
                pass

        print("-----------------------------------------")
        print(user)
        print("-----------------------------------------")
        # if not user:
        #     user = authenticate(username=username, password=password)
        #     print(f"User {user} and User : {username}")
        if user:
            # NOTE:
            # the cookie must be set in response cookie
            # can't be set as httponly from javascript
            jwt_token = jwt_generation(user.id, user.two_factor)
            # response = Response({"token": token.key}, status=status.HTTP_200_OK)
            response = Response(
                {"message": "Login successful"}, status=status.HTTP_200_OK
            )
            response.set_cookie(
                "jwt_token", value=jwt_token, httponly=True, secure=True
            )
            return response

        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )


from datetime import datetime


@api_view(["GET"])
@authentication_classes([])  # Remove all authentication classes
@permission_classes([AllowAny])
@permission_classes([IsAuthenticated])
def user_logout(request):
    response = Response({"message": "Login successful"}, status=status.HTTP_200_OK)
    response.set_cookie(
        "jwt_token", value="", httponly=True, secure=True, expires=datetime(1970, 1, 1)
    )
    return response


from .serializers import PlayerSerializerInfoVer


# added for the Chat authentication test
@api_view(["GET"])
@authentication_classes([])  # Remove all authentication classes
@permission_classes([AllowAny])
@jwt_required_cookie
def check_user(request):
    player = Player.objects.get(pk=request.decoded_token["id"])
    serialized = PlayerSerializerInfoVer(player)
    return Response(
        {
            "message": "User is authenticated",
            "isLoged": True,
            "data": serialized.data,
        }
    )

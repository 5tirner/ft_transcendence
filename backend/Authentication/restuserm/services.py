from django.conf import settings
from django.core.cache import cache
from rest_framework.response import Response
from rest_framework.views import status
from pyotp.totp import TOTP
from base64 import b32encode
from typing import Dict
import datetime, random, string
from datetime import timezone
import jwt
from .models import Player


def generate_new_username(username) -> str:
    random_suffix = "".join(random.choices(string.ascii_letters + string.digits), k=3)
    return username + random_suffix


def create_player(player_data: Dict[str, str]):
    try:
        email = player_data["email"]
        if Player.objects.filter(email=email).exists():
            player = Player.objects.get(email=email)
            return player
        username = player_data["username"]
        if Player.objects.filter(username=username).exists():
            while True:
                update_username = generate_new_username(username)
                if not Player.objects.filter(username=update_username).exists():
                    username = update_username
                    break
        first_name = player_data["first_name"]
        last_name = player_data["last_name"]
        avatar = player_data["avatar"]
        player = Player.objects.create(
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            avatar=avatar,
        )
        return player
    except Exception as e:
        return None


def jwt_generation(id: int, two_factor: bool) -> str:
    payload = {
        "id": id,
        "2fa": two_factor,
        "exp": datetime.datetime.now(timezone.utc) + datetime.timedelta(days=1),
        "iat": datetime.datetime.now(timezone.utc),
    }
    jwt_token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    return jwt_token


def decode_google_id_token(token_id: str) -> Dict[str, str]:
    decoded_token = jwt.decode(token_id, options={"verify_signature": False})
    return decoded_token


from functools import wraps


def jwt_required_cookie(view_func):
    @wraps(view_func)
    def view_wrapped(request, *args, **kwargs):
        if "jwt_token" not in request.COOKIES:
            return Response(
                {"error": "jwt token cookie is missing"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        token_jwt = request.COOKIES.get("jwt_token")
        try:
            request.token = token_jwt
            token_decoded = jwt.decode(
                token_jwt, settings.SECRET_KEY, algorithms=["HS256"]
            )
            # if (token_decoded['2fa']):
            #     return Response({'error' : '2FA is required', 'statusCode' : 401})
            request.decoded_token = token_decoded
            return view_func(request, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return Response(
                {"erro": "Token has been expired"}, status=status.HTTP_401_UNAUTHORIZED
            )
        except jwt.InvalidTokenError:
            return Response(
                {"error": "Invalid Token"}, status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response(
                {"errors": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    return view_wrapped


def tfa_code_check(id_player: int, code: int) -> bool:
    id_player_encode = str(id_player).encode("utf-8")
    return TOTP(b32encode(id_player_encode)).verify(code)


def tfa_qr_code(id_player: int) -> str:
    player_id_encode = str(id_player).encode("utf-8")
    return TOTP(b32encode(player_id_encode)).provisioning_uri(
        name="player", issuer_name="ft_transcendence"
    )

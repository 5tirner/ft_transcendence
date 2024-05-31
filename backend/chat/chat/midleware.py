from channels.middleware import BaseMiddleware

from restuserm.models import Player
from channels.db import database_sync_to_async
import requests


class JwtAuthenticationMiddleWare(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # the auth logic here to validate user
        url = "http://auth:8000/api/usercheck/"
        cookies = self.get_cookies(scope)
        cookies_dict = self.cookies_to_dict(cookies)

        resp = requests.get(url, cookies=cookies_dict)
        if resp.status_code != 200:
            await self.close_connection(send)
            return
        try:
            resp_data = resp.json()
        except:
            await self.close_connection(send)
            return

        user_data = resp_data.get("data", {})
        user_id = user_data.get("id", None)
        if not user_id:
            await self.close_connection(send)
            return
        user = await self.get_user_by_id(user_id)
        scope["user"] = user.username
        return await super().__call__(scope, receive, send)

    def get_cookies(self, scope):
        headers = dict(scope["headers"])
        cookies = headers.get(b"cookie", b"").decode()
        return cookies

    def cookies_to_dict(self, cookie_str):
        cookies = {}
        for cookie in cookie_str.split(";"):
            key, value = cookie.strip().split("=", 1)
            cookies[key] = value
        return cookies

    async def close_connection(self, send):
        await send({"type": "websocket.close", "code": 401})

    @database_sync_to_async
    def get_user_by_id(self, user_id: int) -> Player:
        return Player.objects.get(id=user_id)


# from django.core.cache import cache
# import re
# import jwt
# from django.db import close_old_connections
# from channels.auth import AuthMiddlewareStack
# from restauthe.settings import SECRET_KEY
# from .models import Player
# from channels.db import database_sync_to_async
#
#
# @database_sync_to_async
# def get_player_by_id(id):
#     return Player.objects.get(id=id)
#
#
# class TokenMiddleware:
#     def __init__(self, inner):
#         self.inner = inner
#
#     async def __call__(self, scope, receive, send):
#         close_old_connections()
#         headers = dict(scope["headers"])
#         if b"cookie" in headers:
#             cookies = headers[b"cookie"].decode()
#             match = re.search("jwt_token=(.*)", cookies)
#             if match is not None:
#                 token_key = match.group(1)
#                 await self.decode_token(token_key, scope)
#                 return await self.inner(scope, receive, send)
#         scope["status"] = "Invalid"
#         return await self.inner(scope, receive, send)
#
#     async def decode_token(self, token_key, scope):
#         try:
#             payload = jwt.decode(token_key, SECRET_KEY, algorithms=["HS256"])
#             if payload["twofa"]:
#                 scope["status"] = "Twofa"
#                 return
#             scope["player"] = await get_player_by_id(payload["id"])
#             scope["status"] = "Valid"
#         except Player.DoesNotExist:
#             scope["status"] = "Invalid"
#         except jwt.InvalidTokenError:
#             scope["status"] = "Invalid"
#
#
# MyAuthMiddlewareStack = lambda inner: TokenMiddleware(AuthMiddlewareStack(inner))

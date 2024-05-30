from channels.middleware import BaseMiddleware

from restuserm.models import Player
from channels.db import database_sync_to_async


class JwtAuthenticationMiddleWare(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # the auth logic here to validate user
        jwt_token = self.get_jwt_token(scope)
        print(jwt_token)
        scope["user"] = "taratara"
        return await super().__call__(scope, receive, send)

    def get_jwt_token(self, scope):
        headers = dict(scope["headers"])
        cookies = headers.get(b"cookie", b"").decode()
        cookies = dict(
            cookies.split("=") for cookie in cookies.split("; ") if "=" in cookie
        )
        print("==================== Middleware IN  ===================")
        print(cookies)
        print("==================== Middleware OUT ===================")
        return cookies.get("jwt_token", None)

    @database_sync_to_async
    def get_user_by_id(self, token: str) -> Player:
        pass


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

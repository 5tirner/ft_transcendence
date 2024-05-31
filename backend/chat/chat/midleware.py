from channels.middleware import BaseMiddleware
from restuserm.models import Player
from channels.db import database_sync_to_async
from django.conf import settings
import httpx
from http.cookies import SimpleCookie


class JwtAuthenticationMiddleWare(BaseMiddleware):
    """
    Middleware to authenticate WebSocket connections usin JWT
    """

    async def __call__(self, scope, receive, send):
        cookies = self.get_cookies(scope)
        cookies_dict = self.cookies_to_dict(cookies)

        user_data = await self.authenticate(cookies_dict)
        if not user_data:
            await self.close_connection(send)
            return
        # scope["user"] = user.username
        print(user_data)
        return await super().__call__(scope, receive, send)

    async def authenticate(self, cookies: dict):
        """
        Authenticate the user using the provided cookies.
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(settings.AUTH_URI, cookies=cookies)
            if response.status_code != 200:
                return None
            resp_data = response.json()
        except Exception as e:
            return None

        user_data = resp_data.get("data", {})
        return user_data

    def get_cookies(self, scope):
        """
        Extract cookies from the scope headers
        """
        headers = dict(scope["headers"])
        cookies = headers.get(b"cookie", b"").decode()
        return cookies

    def cookies_to_dict(self, cookie_str):
        """
        conver cookie string to dictionary
        """
        cookies = {}
        for cookie in cookie_str.split(";"):
            key, value = cookie.strip().split("=", 1)
            cookies[key] = value
        return cookies

    async def close_connection(self, send):
        await send({"type": "websocket.close", "code": 401})

import requests
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from restuserm.models import Player  # Import your Player model


class JwtAuth(BaseAuthentication):
    def authenticate(self, request):
        url = "http://auth:8000/api/usercheck/"
        token = request.COOKIES.get("jwt_token", None)

        if not token:
            return None

        cookie = {"jwt_token": token}
        resp = requests.get(url, cookies=cookie)
        if resp.status_code != 200:
            return None

        try:
            resp_data = resp.json()
        except ValueError:
            return None

        user_data = resp_data.get("data", {})
        user_id = user_data.get("id", None)

        if not user_id:
            return None
        try:
            player = Player.objects.get(id=user_id)
        except Player.DoesNotExist:
            raise AuthenticationFailed("Player not found")
        return (player, None)

import requests
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

# from restuserm.models import Player  # Import your Player model


class CustomUser:
    def __init__(self, user_data):
        self.id = user_data.get("id")
        self.username = user_data.get("username")
        self.email = user_data.get("email")
        self.first_name = user_data.get("first_name")
        self.last_name = user_data.get("last_name")
        # Add more fields if necessary

    def is_authenticated(self):
        return True


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
        current_user = CustomUser(user_data)
        return (current_user, None)

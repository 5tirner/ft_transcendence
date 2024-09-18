import json
from .services import jwt_required_cookie
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Player
from rest_framework import status


@api_view(["GET"])
@authentication_classes([])  # Remove all authentication classes
@permission_classes([AllowAny])
@jwt_required_cookie
def UserInfo(request, pk):
    print("===========> UserInfo <===========")
    try:
        print("===========>", pk)
        user = Player.objects.get(id=pk)  # Fetch user by ID
        print("===========>", user.id, user.username)
    except Player.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    user_data = {
        "id": user.id,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "avatar": user.avatar,
    }
    return Response(user_data, status=status.HTTP_200_OK)

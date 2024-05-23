from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView

from .serializers import ConversationsSerializer, MessageSerializer
from .models import ChatRoom, Message
from restuserm.models import Player
from rest_framework.permissions import AllowAny


import jwt
from django.conf import settings
from django.utils.decorators import method_decorator


def jwt_required_cookie(view_func):
    def view_wrapped(request):
        if "jwt_token" not in request.COOKIES:
            return Response({"error": "jwt token cookie is missing", "statusCode": 401})
        token_jwt = request.COOKIES.get("jwt_token")
        try:
            request.token = token_jwt
            token_decoded = jwt.decode(
                token_jwt, settings.SECRET_KEY, algorithms=["HS256"]
            )
            if token_decoded["2fa"]:
                return Response({"error": "2FA is required", "statusCode": 401})
            request.decoded_token = token_decoded
            return view_func(request)
        except jwt.ExpiredSignatureError:
            return Response({"erro": "Token has been expired", "statusCode": 401})
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid Token", "statusCode": 401})
        except Exception as e:
            return Response({"error": str(e), "statusCode": 500})

    return view_wrapped


# Create your views here.
@method_decorator(jwt_required_cookie, name="dispatch")
class GetAllConversations(ListAPIView):
    serializer_class = ConversationsSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # NOTE: set a user hard code

        user = self.request.decoded_token["id"]
        print("cookies ===> ")
        for cookie, value in self.request.COOKIES.items():
            print(f"{cookie}: {value}")
        print("token jwt", self.request.decoded_token)

        player = Player.objects.all()
        for p in player:
            print(p)
        return ChatRoom.objects.filter(members=user)


class GetRoomMessages(ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        room_id = self.kwargs["pk"]
        return Message.objects.filter(chatroom=room_id)

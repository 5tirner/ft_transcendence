from rest_framework.generics import RetrieveAPIView
from rest_framework import generics, status
from rest_framework.authtoken.views import Token, ObtainAuthToken
from rest_framework.response import Response
from .serializers import UserSerializer
from django.utils import timezone
from rest_framework.permissions import AllowAny


class UserRegistrationAPIView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Update last login
            user.last_login = timezone.now()
            user.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response(
                {"token": token.key, "user": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


class MyObtainAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        # Update last login
        user.last_login = timezone.now()
        user.save()

        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": user.username})


class UserDetailsAPIView(RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Player


class PlayerSerializerInfo(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "avatar",
            "status",
            "alias_name",
            "two_factor",
            "wins",
            "losses",
            "champions",
        ]


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email")


# This is added for the temporary Users for Chat testing


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = Player(
            username=validated_data["username"], email=validated_data["email"]
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class PlayerSerializerInfoVer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "avatar",
            "losses",
            "wins",
            "two_factor"
        ]

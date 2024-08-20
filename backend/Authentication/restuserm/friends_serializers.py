from rest_framework import serializers

from restuserm.models import Friendships, Player


class PlayerSerializerInformation(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ["id", "username", "avatar", "status"]


class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendships
        fields = ["id", "sender", "receiver", "status"]

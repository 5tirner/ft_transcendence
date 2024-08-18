from rest_framework import serializers

from restuserm.models import Player


class PlayerSerializerInformation(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = [
            "id",
            "username",
            "avatar",
        ]

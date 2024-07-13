from rest_framework import serializers
from .models import gameInfo

class gameInfoModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = gameInfo
        fields = ['login', 'wins', 'loses', 'draws', 'gamesPlayed', 'codeToPlay']
from rest_framework import serializers
from .models import pongGameInfo

class pongGameInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = pongGameInfo
        fields = ['login', 'wins', 'loses', 'draws', 'gamesPlayed', 'codeToPlay']
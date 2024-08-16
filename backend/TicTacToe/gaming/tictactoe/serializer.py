from rest_framework import serializers
from .models import gameInfo, history

class gameInfoModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = gameInfo
        fields = ['login', 'wins', 'loses', 'draws', 'gamesPlayed', 'codeToPlay']

class historyModelSirializer(serializers.ModelSerializer):
    class Meta:
        model = history
        fields = ['you', 'oppenent', 'winner']
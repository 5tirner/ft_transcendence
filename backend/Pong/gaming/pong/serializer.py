from rest_framework import serializers
from .models import pongGameInfo, playerAndHisPic, pongHistory

class pongGameInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = pongGameInfo
        fields = ['login', 'wins', 'loses', 'draws', 'gamesPlayed', 'codeToPlay']


class pongAvatarsSerilizer(serializers.ModelSerializer):
    class Meta:
        model = playerAndHisPic
        fields = ['login', 'pic']

class pongHistoryInfos(serializers.ModelSerializer):
    class Meta:
        model = pongHistory
        fields = ['you', 'oppenent', 'winner']


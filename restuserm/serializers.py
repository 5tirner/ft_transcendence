from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Player

class PlayerSerializerInfo(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'username', 'email', 'fist_name', 'last_name', 'avatar', 'status', 'alias_name', 'two_factor', 'wins', 'losses', 'champions']

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')
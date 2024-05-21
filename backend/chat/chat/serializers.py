from django.contrib.auth.models import User
from rest_framework import serializers
from .models import ChatRoom, Message


# from api.serializers import UserSerializer
class ConversationsSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChatRoom
        fields = ("id", "name", "members")
        # fields = ("id", "name", "members")

    def to_representation(self, instance):
        """
        This method is overridden to customize the representation of the serializer.
        """
        representation = super().to_representation(instance)
        # members_info = UserSerializer(instance.members.all(), many=True).data
        # representation["members"] = members_info
        return representation


class MessageSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ["id", "chatroom", "sender", "username", "content", "timestamp"]

    def get_username(self, obj):
        return obj.sender.username

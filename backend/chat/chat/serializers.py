from django.contrib.auth.models import User
from rest_framework import serializers
from .models import ChatRoom, Message

# from api.serializers import UserSerializer


class UserSerializer(serializers.ModelSerializer):
    imgUrl = serializers.SerializerMethodField()

    class Meta:
        model = User  # Assuming User is your user model
        fields = ("id", "username", "email", "imgUrl")

    def get_imgUrl(self, obj):
        return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnVVc2VDK5p-WDPdl-BzF5TbI8DwokAdjHU-YU9C4gscDaFgRcWkBJQ35lHYH2SxOlG_s&usqp=CAU"


class ConversationsSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChatRoom
        fields = ("id", "name", "members")

    def to_representation(self, instance):
        """
        This method is overridden to customize the representation of the serializer.
        """
        representation = super().to_representation(instance)
        members_info = UserSerializer(instance.members.all(), many=True).data
        representation["members"] = members_info
        return representation


class MessageSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ["id", "chatroom", "sender", "username", "content", "timestamp"]

    def get_username(self, obj):
        return obj.sender.username

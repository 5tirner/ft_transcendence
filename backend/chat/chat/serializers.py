from django.contrib.auth.models import User
from rest_framework import serializers
from .models import ChatRoom, Message
from django.db.models import Count


# from api.serializers import UserSerializer
class ConversationsSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChatRoom
        fields = ("id", "name", "members")

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


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ["name", "members"]

    def validate(self, data):
        members = list(data.get("members", []))
        # Ensure the requesting user is in the members list
        if self.context["request"].user not in members:
            members.append(self.context["request"].user)

        # Check if a chat room with the exact same set of members already exists
        existing_rooms = ChatRoom.objects.annotate(num_members=Count("members")).filter(
            num_members=len(members)
        )
        for room in existing_rooms:
            room_members = set(room.members.all())
            if room_members == set(members):
                raise serializers.ValidationError({"chatroom": room})
        return data

from django.contrib.auth.models import User
from rest_framework import serializers
from .models import ChatRoom, Message
from restuserm.models import Player
from django.db.models import Q


# from api.serializers import UserSerializer
class ConversationsSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ["id", "name", "user", "last_message"]

    def get_user(self, obj):
        request_user = self.context["request"].user
        user = obj.user_b if obj.user_a == request_user else obj.user_a
        return {
            "id": user.id,
            "username": user.username,
            "avatar": user.avatar,
        }

    def get_last_message(self, obj):
        last_message = obj.messages.order_by("-timestamp").first()
        request_user = self.context["request"].user
        unread_count = (
            obj.messages.filter(readed=False).exclude(sender=request_user).count()
        )

        if last_message:
            return {
                "content": last_message.content,
                "timestamp": last_message.timestamp,
                "unreaded": unread_count,
            }
        return {"content": None, "timestamp": obj.created_at, "unreaded": None}


class MessageSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ["id", "chatroom", "sender", "username", "content", "timestamp"]

    def get_username(self, obj):
        return obj.sender.username


class ChatRoomSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)

    class Meta:
        model = ChatRoom
        fields = ["user_a", "user_b", "created_at", "username"]
        read_only_fields = ["user_a", "user_b", "created_at"]

    def create(self, validated_data):
        user_a = self.context["request"].user
        username = validated_data.pop("username")
        try:
            user_b = Player.objects.get(username=username)
        except Player.DoesNotExist:
            raise serializers.ValidationError("User B does not exist")

        if user_a == user_b:
            raise serializers.ValidationError("can't create room with yourself")

        # Check if a chat room already exists between the two users
        chat_room = ChatRoom.objects.filter(
            Q(user_a=user_a, user_b=user_b) | Q(user_a=user_b, user_b=user_a)
        ).first()

        if chat_room:
            return chat_room

        chat_room = ChatRoom.objects.create(
            name=f"{user_a.username}&{user_b.username}", user_a=user_a, user_b=user_b
        )
        return chat_room


class SubmitMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["chatroom", "sender", "content"]

from rest_framework import serializers
from .models import ChatRoom, Message
import requests
from django.db.models import Q


class ConversationsSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ["id", "name", "user", "last_message"]

    def get_user(self, obj):
        request_user_id = self.context["request"].user.id
        user_id = obj.user_b_id if obj.user_a_id == request_user_id else obj.user_a_id

        user_data = self.get_user_data(user_id)
        return {
            "id": user_id,
            "username": user_data.get("username", "Unknown"),
            "avatar": user_data.get("avatar", None),
        }

    def get_user_data(self, user_id):
        """Fetch user data from the external auth service."""
        url = f"http://auth:8000/user/{user_id}/"
        try:
            resp = requests.get(url, cookies=self.context["request"].COOKIES)
            if resp.status_code == 200:
                return resp.json()
        except requests.RequestException:
            return {}
        return {}

    def get_last_message(self, obj):
        last_message = obj.messages.order_by("-timestamp").first()
        request_user_id = self.context["request"].user.id
        unread_count = (
            obj.messages.filter(readed=False).exclude(sender_id=request_user_id).count()
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
        fields = ["id", "chatroom", "sender_id", "username", "content", "timestamp"]

    def get_username(self, obj):
        """Fetch username from the external auth service by user ID."""
        url = f"http://auth:8000/user/{obj.sender_id}/"
        try:
            resp = requests.get(url, cookies=self.context["request"].COOKIES)
            if resp.status_code == 200:
                return resp.json().get("username", "Unknown")
        except requests.RequestException:
            return "Unknown"
        return "Unknown"


class ChatRoomSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)
    user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ["id", "name", "user", "last_message", "user_id"]
        read_only_fields = ["id", "name", "user", "last_message"]

    def create(self, validated_data):
        user_a = self.context["request"].user
        user_b_id = validated_data.pop("user_id")

        user_b = self.get_user_from_auth_service(user_b_id)

        if user_a.id == user_b["id"]:
            raise serializers.ValidationError("Can't create a room with yourself")

        if self.is_blocked(user_a.id, user_b_id):
            raise serializers.ValidationError("User is blocked")

        chat_room = ChatRoom.objects.filter(
            Q(user_a_id=user_a.id, user_b_id=user_b_id)
            | Q(user_a_id=user_b_id, user_b_id=user_a.id)
        ).first()

        if chat_room:
            return chat_room

        # Create a new chat room
        chat_room = ChatRoom.objects.create(
            name=f"{user_a.username}&{user_b['username']}",
            user_a_id=user_a.id,
            user_b_id=user_b_id,
        )
        return chat_room

    def get_user_from_auth_service(self, user_id):
        """Fetch user details from external authentication service."""
        url = f"http://auth:8000/user/{user_id}/"  # External auth service URL
        response = requests.get(url, cookies=self.context["request"].COOKIES)
        if response.status_code != 200:
            raise serializers.ValidationError("User does not exist")

        return response.json()

    def is_blocked(self, user_a_id, user_b_id):
        """Check if a user is blocked from the external auth service."""
        url = "http://auth:8000/api/friendships/check_blocked/"
        data = {"user_a_id": user_a_id, "user_b_id": user_b_id}
        response = requests.post(
            url, json=data, cookies=self.context["request"].COOKIES
        )

        if response.status_code == 200:
            return response.json().get("blocked", False)

        return False

    def get_user(self, obj):
        """Get the other user in the chat room from external service."""
        request_user = self.context["request"].user
        user_b_id = obj.user_b_id if obj.user_a_id == request_user.id else obj.user_a_id

        user_b = self.get_user_from_auth_service(user_b_id)

        return {
            "id": user_b["id"],
            "username": user_b["username"],
            "avatar": user_b["avatar"],
        }

    def get_last_message(self, obj):
        return {
            "content": None,
            "timestamp": obj.created_at,
            "unreaded": None,
        }


#
class SubmitMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["chatroom", "sender_id", "content"]

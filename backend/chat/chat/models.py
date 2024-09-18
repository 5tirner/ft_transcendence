# Create your models here.
from django.db import models
import uuid
import requests

from rest_framework.generics import ValidationError

# from restuserm.models import Player


class ChatRoom(models.Model):
    name = models.CharField(max_length=100, unique=True, default=uuid.uuid4)
    user_a_id = models.IntegerField()  # Store user_a as an integer (user ID)
    user_b_id = models.IntegerField()  # Store user_b as an integer (user ID)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Fetch usernames from the auth service for both users
        members_list = ", ".join(
            [self.get_username(self.user_a_id), self.get_username(self.user_b_id)]
        )
        return f"{self.name[:4]} ==> {members_list}"

    def get_username(self, user_id):
        """Fetch username from the external auth service by user ID."""
        url = f"http://auth:8000/user/{user_id}/"
        try:
            resp = requests.get(url, cookies=self.context["request"].COOKIES)
            if resp.status_code == 200:
                return resp.json().get("username", "Unknown")
        except requests.RequestException:
            return "Unknown"
        return "Unknown"


class Message(models.Model):
    chatroom = models.ForeignKey(
        ChatRoom, on_delete=models.CASCADE, related_name="messages"
    )
    sender_id = models.IntegerField()  # Store sender as an integer (user ID)
    content = models.TextField()
    readed = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f"Message from {self.get_username(self.sender_id)} in {self.chatroom.name}"
        )

    def get_username(self, user_id):
        """Fetch username from the external auth service by user ID."""
        url = f"http://auth:8000/user/{user_id}/"
        try:
            resp = requests.get(url, cookies=self.context["request"].COOKIES)
            if resp.status_code == 200:
                return resp.json().get("username", "Unknown")
        except requests.RequestException:
            return "Unknown"
        return "Unknown"

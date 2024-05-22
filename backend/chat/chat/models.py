from django.db import models

# Create your models here.
from django.db import models
import uuid

from rest_framework.generics import ValidationError
from restuserm.models import Player


# Create your models here.
class ChatRoom(models.Model):
    name = models.CharField(max_length=100, unique=True, default=uuid.uuid4)
    members = models.ManyToManyField(Player, related_name="chatrooms")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        members_list = ", ".join([member.username for member in self.members.all()])
        return f"{self.name[:4]} ==> {members_list}"


class Message(models.Model):
    chatroom = models.ForeignKey(
        ChatRoom, on_delete=models.CASCADE, related_name="messages"
    )
    sender = models.ForeignKey(Player, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender.username} in {self.chatroom.name}"

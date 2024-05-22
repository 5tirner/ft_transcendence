# Create your models here.

from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from enum import Enum


class Player(AbstractBaseUser):

    class Status(Enum):
        OFFLINE = "OFF"
        ONLINE = "ON"
        INGAME = "ING"

    STATUS_CHOICES = [
        (Status.ONLINE.value, "ONLINE"),
        (Status.OFFLINE.value, "OFFLINE"),
        (Status.INGAME.value, "INGAME"),
    ]

    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=20, blank=False, null=False, unique=False)
    email = models.EmailField(max_length=30, blank=False, null=False, unique=True)
    first_name = models.CharField(max_length=20, blank=False, null=False)
    last_name = models.CharField(max_length=20, blank=False, null=False)
    alias_name = models.CharField(max_length=20, blank=False, null=True)
    avatar = models.URLField(blank=False, null=False)
    champions = models.IntegerField(blank=False, null=False, default=0)
    wins = models.IntegerField(blank=False, null=False, default=0)
    losses = models.IntegerField(blank=False, null=False, default=0)
    two_factor = models.BooleanField(default=False)
    status = models.CharField(
        max_length=3, choices=STATUS_CHOICES, default=Status.OFFLINE.value
    )

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"

    def __str__(self):
        return f"Player: [ email: {self.email}, username: {self.username} ]"


class Friendships(AbstractBaseUser):
    class Status(Enum):
        PENDING = "PEN"
        ACCEPTED = "ACP"

    STATUS_AVAILABLE = [
        (Status.PENDING.value, "PENDING"),
        (Status.ACCEPTED.value, "ACCEPTED"),
    ]
    id = models.AutoField(primary_key=True)
    status = models.CharField(
        max_length=3, choices=STATUS_AVAILABLE, default=Status.PENDING.value
    )
    sender = models.ForeignKey(
        "Player", on_delete=models.CASCADE, related_name="friend_request_sent"
    )
    receiver = models.ForeignKey(
        "Player", on_delete=models.CASCADE, related_name="friend_request_received"
    )

    def __str__(self):
        return f"{self.sender.username} ---> {self.receiver.username}"


class PlayerGameMatch(AbstractBaseUser):
    id = models.AutoField(primary_key=True)
    id_player = models.ForeignKey(
        Player, on_delete=models.CASCADE, null=False, blank=False
    )
    id_match = models.ForeignKey(
        "Match", on_delete=models.CASCADE, null=False, blank=False
    )
    won = models.BooleanField(default=False, null=False, blank=False)
    score = models.IntegerField(default=0, null=False, blank=False)
    exec_path = models.CharField(max_length=255, null=True, blank=False)

    def __str__(self) -> str:
        return f"Match score {self.score}"


class Match(AbstractBaseUser):
    class State(Enum):
        PLAYED = "PLYD"
        UNPLAYED = "UPLY"

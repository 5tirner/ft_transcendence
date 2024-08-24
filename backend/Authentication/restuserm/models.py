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
    avatar = models.URLField(
        default="https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg",
        blank=False,
        null=False,
    )
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
        BLOCKED = "BLK"

    STATUS_AVAILABLE = [
        (Status.PENDING.value, "PENDING"),
        (Status.ACCEPTED.value, "ACCEPTED"),
        (Status.BLOCKED.value, "BLOCKED"),
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

        @classmethod
        def cases(cls):
            return [(case.value, case.name) for case in cls]

    class Game(Enum):
        PONG = "PON"
        TICTACTOE = "TIC"

        @classmethod
        def cases(cls):
            return [(case.value, case.name) for case in cls]

    id = models.AutoField(primary_key=True)
    state = models.CharField(
        max_length=4,
        choices=State.cases(),
        null=False,
        blank=False,
        default=State.UNPLAYED.value,
    )
    round = models.IntegerField(default=1)
    game = models.CharField(
        max_length=3,
        choices=Game.cases(),
        null=False,
        blank=False,
        default=Game.PONG.value,
    )
    # <-------------- ziko add tournament models.ForeignKey here -------------->


# from django.contrib.auth.models import User
# from django.db import models

# class UserProfile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     display_name = models.CharField(max_length=100)
#     avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
#     # Add any other fields as needed

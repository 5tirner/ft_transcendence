from django.db import models

class players(models.Model):
    gcreator = models.CharField(max_length=100)
    oppenent = models.CharField(max_length=100)
    roomcode = models.CharField(max_length=100)
    gamestat = models.BooleanField(default=False)
    board = models.CharField(max_length=8, default=".........")
    channel = models.CharField(max_length=100)

class online(models.Model):
    name = models.CharField(max_length=100)

class wannaplay(models.Model):
    name = models.CharField(max_length=100)
    joinhim = models.CharField(max_length=20)

class ongame(models.Model):
    name = models.CharField(max_length=100)

class stats(models.Model):
    name = models.CharField(max_length=100)
    wins = models.IntegerField(default=0)
    loses = models.IntegerField(default=0)
    draws = models.IntegerField(default=0)
    gamesPlayed = models.IntegerField(default=0)
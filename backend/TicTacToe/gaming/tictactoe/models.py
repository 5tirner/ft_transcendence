from django.db import models

class gameInfo(models.Model):
    login = models.CharField(max_length=30, unique=True)
    wins = models.IntegerField(default=0)
    loses = models.IntegerField(default=0)
    draws = models.IntegerField(default=0)
    gamesPlayed = models.IntegerField(default=0)
    codeToPlay = models.CharField(max_length=30)

# class onLobby(models.Model):
#     login = models.CharField(max_length=20)

class playerAndHisPic(models.Model):
    login=models.CharField(max_length=30, unique=True)
    pic=models.CharField(max_length=200)

class history(models.Model):
    you = models.CharField(max_length=30)
    oppenent = models.CharField(max_length=30)
    winner = models.CharField(max_length=30)
from django.db import models

class gameInfo(models.Model):
    login = models.CharField(max_length=20)
    wins = models.IntegerField(default=0)
    loses = models.IntegerField(default=0)
    draws = models.IntegerField(default=0)
    gamesPlayed = models.IntegerField(default=0)
    codeToPlay = models.CharField(max_length=20)

# class onLobby(models.Model):
#     login = models.CharField(max_length=20)

class playerAndHisPic(models.Model):
    login=models.CharField(max_length=20)
    pic=models.CharField(max_length=100)

class history(models.Model):
    you = models.CharField(max_length=20)
    oppenent = models.CharField(max_length=20)
    winner = models.CharField(max_length=20)
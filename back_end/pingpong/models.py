from django.db import models

class Players(models.Model):
    username = models.CharField(max_length = 30)
    level = models.IntegerField(default = 0)
    gameplayed = models.IntegerField(default = 0)
    gamewined = models.IntegerField(default = 0)
    gamelosed = models.IntegerField(default = 0)

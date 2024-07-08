from django.db import models

class players(models.Model):
    gcreator = models.CharField(max_length=100)
    oppenent = models.CharField(max_length=100)
    roomcode = models.CharField(max_length=100)
    gamestat = models.BooleanField(default=False)
    board = models.CharField(max_length=8, default=".........")
    channel = models.CharField(max_length=100)
from django.db import models

class players(models.Model):
    gcreator = models.CharField(max_length=100)
    oppenent = models.CharField(max_length=100)
    roomcode = models.CharField(max_length=100)
    gamestat = models.BooleanField(default=False)
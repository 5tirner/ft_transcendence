from django.db import models

# Create your models here.
class tttgame(models.Model):
    room_id = models.CharField(max_length=100)
    game_creator = models.CharField(max_length=100)
    game_oppenent = models.CharField(max_length=100, blank=True, null=True)
    game_over = models.BooleanField(default=False)
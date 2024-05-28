from django.db import models

# Create your models here.
class tttgame(models.Model):
    room_id = models.CharField(max_length=100)
    game_creator = models.CharField(max_length=100)
    game_oppenent = models.CharField(max_length=100, blank=True, null=True)
    game_over = models.BooleanField(default=False)

# For THe Comming Things:
# class tttplayer(models.Model):
#     alias = models.CharField(max_length=100)
#     realName = models.CharField(max_length=100)
#     game_number = models.IntegerField(default=0)
#     wins = models.IntegerField(default=0)
#     loses = models.IntegerField(default=0)

# class tttGame(models.Model):
#     room_id = models.CharField(max_length=100)
#     player1 = models.CharField(max_length=100)
#     player2 = models.CharField(max_length=100)
#     winnerRealName = models.CharField(max_length=100)
from django.contrib import admin
from .models import Player, Friendships, PlayerGameMatch

# @admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'alias_name', 'status')
    list_filter = ('status',)
    search_fields = ('username', 'email', 'first_name', 'last_name', 'alias_name')

admin.site.register(Player, PlayerAdmin)

class FriendshipsAdmin(admin.ModelAdmin):
    list_display = ('id', 'status', 'sender', 'receiver')
    list_filter = ('status', 'sender', 'receiver')
    search_fields = ('sender__username', 'receiver__username')

admin.site.register(Friendships, FriendshipsAdmin)

class PlayerGameMatchAdmin(admin.ModelAdmin):
    list_display = ('id', 'id_match', 'id_player', 'score', 'exec_path', 'won')
    list_filter = ('id_match', 'id_player', 'won')
    search_fields = ('id_match__name', 'id_player__username')

admin.site.register(PlayerGameMatch, PlayerGameMatchAdmin)
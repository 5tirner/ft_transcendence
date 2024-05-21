from django.contrib import admin
from .models import Message, ChatRoom, Player

admin.site.register(Player)
admin.site.register(Message)
admin.site.register(ChatRoom)

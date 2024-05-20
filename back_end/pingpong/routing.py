from django.urls import path
from . import consumer
websocket_urlpatterns = [
    path('ws/myurl/', consumer.numbers.as_asgi())
]
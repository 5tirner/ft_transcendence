"""
ASGI config for back_end project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
from channels.routing import ProtocolTypeRouter
from django.core.asgi import get_asgi_application
from pingpong.routing import websocket_urlpatterns
from channels.auth import AuthMiddlewareStack
from channels.routing import URLRouter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back_end.settings')

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': AuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
})

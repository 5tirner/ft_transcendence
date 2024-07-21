"""
ASGI config for gaming project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from pong.wslist import wsPatterns
from .authMiddleWare import JwtAuthenticationMiddleWare

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gaming.settings')

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': JwtAuthenticationMiddleWare(URLRouter(wsPatterns)),
})

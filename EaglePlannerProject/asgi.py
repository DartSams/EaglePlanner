"""
ASGI config for EaglePlannerProject project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

# import os

# from django.core.asgi import get_asgi_application

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EaglePlannerProject.settings')

# application = get_asgi_application()


import os
import channels
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "EaglePlannerProject.settings")
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import EaglePlannerProject.routing

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": AuthMiddlewareStack(
        URLRouter(
            EaglePlannerProject.routing.websocket_urlpatterns
        )
    ),
})
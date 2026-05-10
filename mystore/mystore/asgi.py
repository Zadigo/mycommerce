import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mystore.settings')

django_asgi_application = get_asgi_application()

# This loads the user model before apps
# is loaded so we need to do the import
# at this level after the "get_asgi_application". See:
# https://github.com/django/daphne/issues/347
# https://channels.readthedocs.io/en/stable/deploying.html#configuring-the-asgi-application
from shop import routing

application = ProtocolTypeRouter({
    'http': django_asgi_application,
    'websocket': AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(routing.websocket_urlpatterns)
        )
    )
})

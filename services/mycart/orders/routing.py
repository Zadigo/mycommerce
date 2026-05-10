from django.urls import re_path

from orders import consumers

websocket_urlpatterns = [
    re_path(
        r'ws/orders/$',
        consumers.LiveOrdersConsumer.as_asgi()
    )
]

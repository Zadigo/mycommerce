from django.urls import re_path

from orders import consumers

urlpatterns = [
    re_path(
        r'ws/orders/$',
        consumers.LiveOrdersConsumer.as_asgi()
    )
]

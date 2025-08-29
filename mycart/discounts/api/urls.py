from django.urls import re_path
from discounts.api import views

urlpatterns = [
    re_path(
        r'^(?P<encoded_name>[a-zA-Z0-9]+)/apply$',
        views.apply_discount,
        name='apply_discount'
    )
]

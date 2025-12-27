from cart.api import views
from django.urls import re_path

app_name = 'cart_api'

urlpatterns = [
    re_path(
        r'^(?P<unique_id>[a-zA-Z0-9]+)/items$',
        views.ListCartView.as_view(),
        name='cart'
    ),
    re_path(
        r'^(?P<unique_id>[a-zA-Z0-9]+)/delete$',
        views.DeleteFromCart.as_view(),
        name='delete'
    ),
    re_path(
        r'^create$',
        views.CreateCartView.as_view(),
        name='create'
    ),
    re_path(
        r'^session-id$',
        views.CreateSessionID.as_view(),
        name='session_id'
    ),
    re_path(
        r'^$',
        views.ListCartView.as_view(),
        name='list'
    )
]

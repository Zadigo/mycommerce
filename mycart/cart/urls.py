from django.urls import re_path

from cart.api import views

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
        r'^(?P<unique_id>[a-zA-Z0-9]+)/update$',
        views.UpdateInCartView.as_view(),
        name='update'
    ),
    re_path(
        r'^add$',
        views.AddToCartView.as_view(),
        name='add'
    ),
    re_path(
        r'^create$',
        views.AddToCartView.as_view(),
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

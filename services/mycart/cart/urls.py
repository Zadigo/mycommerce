from cart.api import views
from django.urls import re_path

app_name = 'cart_api'

urlpatterns = [
    re_path(
        r'^(?P<unique_id>[a-zA-Z0-9]+)/items$',
        views.ListCartItemsView.as_view(),
        name='cart_items'
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
        r'^$',
        views.ListCartView.as_view(),
        name='list'
    )
]

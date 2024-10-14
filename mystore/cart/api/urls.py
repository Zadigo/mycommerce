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
        name='cart'
    ),
    re_path(
        r'^(?P<unique_id>\d+)/update$',
        views.UpdateInCartView.as_view(),
        name='update_cart'
    ),
    re_path(
        r'^add$',
        views.AddToCartView.as_view(),
        name='add_to_cart'
    ),
    re_path(
        r'^authenticate$',
        views.authenticate_user_cart,
        name='authenticate_cart'
    ),
    re_path(
        r'^session-id$',
        views.CreateSessionID.as_view(),
        name='create_session_id'
    ),
    re_path(
        r'^$',
        views.ListCartsView.as_view(),
        name='list_carts'
    )
]

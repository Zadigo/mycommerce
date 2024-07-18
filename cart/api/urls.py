from django.urls import re_path

from cart.api import views

app_name = 'cart_api'

urlpatterns = [
    re_path(
        r'^(?P<pk>\d+)$',
        views.ListCart.as_view()
    ),
    re_path(
        r'^remove$',
        views.delete_from_cart
    ),
    re_path(
        r'^add$',
        views.add_to_cart
    ),
    re_path(
        r'^authenticate$',
        views.authenticate_user_cart
    ),
    re_path(
        r'^update$',
        views.update_in_cart
    ),
    re_path(
        r'^$',
        views.ListAllCarts.as_view()
    )
]

from django.urls import re_path

from cart import views

api_name = 'cart'

urlpatterns = [
    re_path(r'success', views.success_view),
    re_path(r'payment', views.payment_view),
    re_path(r'remove', views.delete_from_cart_view),
    re_path(r'update', views.update_in_cart_view),
    re_path(r'add', views.add_to_cart_view),
    re_path(r'^$', views.cart_view)
]

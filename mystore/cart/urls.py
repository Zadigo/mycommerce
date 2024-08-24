from django.urls import re_path

from cart import views

app_name = 'cart'

urlpatterns = [
    re_path(r'^success$', views.PaymentSuccessView.as_view(), name='success'),
    re_path(r'^payment$', views.PaymentView.as_view(), name='payment'),
    re_path(r'^shipment$', views.ShipmentView.as_view(), name='shipment'),
    re_path(r'^$', views.CartView.as_view(), name='list')
]

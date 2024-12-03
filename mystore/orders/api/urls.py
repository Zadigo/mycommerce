from django.urls import re_path

from orders.api import views

app_name = 'orders_api'

urlpatterns = [
    re_path(
        r'^delivery-options$',
        views.ListDeliveryOptions.as_view()
    ),
    re_path(
        r'^create$',
        views.CapturePaymentIntent.as_view(),
        name='create'
    ),
    re_path(
        r'^intent/update$',
        views.UpdatePaymentIntent.as_view(),
        name='update'
    ),
    re_path(
        r'^intent$',
        views.CreatePaymentIntent.as_view(),
        name='intent'
    ),
    re_path(
        r'^$',
        views.ListCustomerOrders.as_view()
    )
]

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
        views.new_customer_order,
        name='create'
    ),
    re_path(
        r'^$',
        views.ListCustomerOrders.as_view()
    )
]

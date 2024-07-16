from django.urls import re_path

from orders.api import views

app_name = 'orders_api'

urlpatterns = [
    re_path(r'^$', views.ListCustomerOrders.as_view())
]

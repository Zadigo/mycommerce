
from django.urls import re_path

from orders.views import ExecutePaymentView, PaymentSuccessfulView, PaymentView

api_name = 'orders'

urlpatterns = [
    re_path(r'^payment/successful$', PaymentSuccessfulView.as_view(), name='execute_payment'),
    re_path(r'^payment/execute$', ExecutePaymentView.as_view(), name='execute_payment'),
    re_path(r'^payment$', PaymentView.as_view(), name='payment')
]


from django.urls import re_path

from orders import views

api_name = 'orders'

urlpatterns = [
    re_path(
        r'^payment/successful$',
        views.PaymentSuccessfulView.as_view(), 
        name='execute_payment'
    ),
    re_path(
        r'^payment/execute$', 
        views.ExecutePaymentView.as_view(),
        name='execute_payment'
    ),
    re_path(
        r'^payment$', 
        views.PaymentView.as_view(), 
        name='payment'
    )
]

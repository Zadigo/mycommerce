from django.urls import re_path

from discounts.api import views

app_name = 'discounts'

urlpatterns = [
    re_path(
        r'^apply$',
        views.ApplyDiscountApi.as_view(),
        name='apply'
    )
]

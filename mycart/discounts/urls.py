from discounts.api import views
from django.urls import re_path

app_name = 'discounts'

urlpatterns = [
    re_path(
        r'^apply$',
        views.ApplyDiscountView.as_view(),
        name='apply'
    )
]

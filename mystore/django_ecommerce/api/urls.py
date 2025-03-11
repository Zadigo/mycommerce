from django.urls import re_path
from django_ecommerce.api import views

app_name = 'ecommerce_api'

urlpatterns = [
    re_path(
        r'^legal',
        views.PolicyDetails.as_view(),
        name='legal_business'
    )
]

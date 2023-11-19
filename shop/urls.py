from django.urls import include, re_path
from rest_framework.routers import DefaultRouter

from shop import views

app_name = 'shop'

urlpatterns = [
    re_path(
        r'^product/(?P<slug>[a-z\-]+)$',
        views.ProductView.as_view(),
        name='product'
    )
]

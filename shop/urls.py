from django.urls import re_path

from shop import views

app_name = 'shop'

urlpatterns = [
    re_path(
        r'^product/(?P<slug>[a-z\-]+)$',
        views.ProductView.as_view(),
        name='product'
    )
]

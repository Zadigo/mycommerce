from shop.api import views
from django.urls import re_path

app_name = 'shop_api'

urlpatterns = [
    re_path(r'^like$', views.like_product_view, name='like'),
    re_path(r'^filter-images$', views.filter_images),
    re_path(r'^images$', views.images),
    re_path(r'^products$', views.products)
]

from shop.api import views
from django.urls import re_path

app_name = 'shop_api'

urlpatterns = [
    re_path(
        r'^products/(?P<pk>\d+)/upload-images$',
        views.upload_images_to_product
    ),
    re_path(r'^products/(?P<pk>\d+)/update$', views.update_product),
    re_path(r'^products/(?P<pk>\d+)$', views.get_product),
    re_path(r'^like$', views.like_product_view, name='like'),
    re_path(r'^filter-images$', views.filter_images),
    re_path(r'^images$', views.list_images),
    re_path(r'^recommendations$', views.list_recommendations),
    re_path(r'^images/associate$', views.associate_images),
    re_path(r'^images/upload$', views.upload_images),
    re_path(r'^search$', views.search_shop),
    re_path(
        r'^products/upload$', 
        views.upload_products
    ),
    re_path(r'^products$', views.list_products)
]

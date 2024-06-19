from django.urls import include, path, re_path

from shop.api.views import admin as admin_views
from shop.api.views import shop as shop_views

app_name = 'shop_api'

adminpatterns = [
    re_path(
        r'^products/(?P<pk>\d+)/upload-images$',
        admin_views.upload_images_to_product
    ),
    re_path(
        r'^products/(?P<pk>\d+)/update$',
        admin_views.update_product
    ),
    re_path(
        r'^filter-images$',
        admin_views.filter_images
    ),
    re_path(
        r'^images$',
        admin_views.ListImages.as_view()
    ),
    re_path(
        r'^images/associate$',
        admin_views.associate_images
    ),
    re_path(
        r'^images/upload$',
        admin_views.upload_images
    ),
    re_path(
        r'^products/upload$',
        admin_views.upload_products
    )
]

urlpatterns = [
    path('admin/', include((adminpatterns, 'admin'))),
    re_path(
        r'^products/(?P<pk>\d+)$',
        shop_views.get_product
    ),
    re_path(
        r'^recommendations$',
        shop_views.list_recommendations
    ),
    re_path(
        r'^products$',
        shop_views.list_products
    )
]

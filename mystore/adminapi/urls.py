from adminapi import views
from django.urls import re_path

app_name = 'admin_api'

urlpatterns = [
    re_path(
        r'^products/(?P<pk>\d+)/upload-images$',
        views.UploadImagesToProduct.as_view(),
        name='upload_images_to_product'
    ),
    re_path(
        r'^products/(?P<pk>\d+)$',
        views.GetProduct.as_view(),
        name='product'
    ),
    re_path(
        r'^filter-images$',
        views.filter_images,
        name='filter'
    ),
    re_path(
        r'^images/associate$',
        views.associate_images,
        name='associate'
    ),
    re_path(
        r'^products/upload$',
        views.upload_products,
        name='upload_to_product'
    ),
    re_path(
        r'^products/create$',
        views.CreateProduct.as_view(),
        name='create_product'
    ),
    re_path(
        r'^statistics$',
        views.CalculateShopStatistics.as_view(),
        name='statistics'
    ),
    re_path(
        r'^images/upload$',
        views.UploadImages.as_view(),
        name='upload'
    ),
    re_path(
        r'^images$',
        views.ListImages.as_view(),
        name='images'
    ),
    re_path(
        r'^products$',
        views.ListProducts.as_view(),
        name='products'
    )
]

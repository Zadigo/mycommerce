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
    path(
        'admin/',
        include((adminpatterns, 'admin'))
    ),
    re_path(
        r'^products/(?P<pk>\d+)$',
        shop_views.GetProduct.as_view()
    ),
    # re_path(
    #     r'^products/search$',
    #     shop_views.SearchShop.as_view(),
    #     name='api_products_search'
    # ),
    re_path(
        r'^products/recommendations$',
        shop_views.ListRecommendations.as_view(),
        name='api_list_recommendations'
    ),
    re_path(
        r'^liked$',
        shop_views.LikedProductsView.as_view(),
        name='api_list_liked_products'
    ),
    re_path(
        r'^products$',
        shop_views.ListProducts.as_view(),
        name='api_list_products'
    )
]

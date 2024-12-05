from django.urls import re_path
from shop.api import views

app_name = 'shop_api'

urlpatterns = [
    re_path(
        r'^products/(?P<pk>\d+)$',
        views.GetProduct.as_view(),
        name='product'
    ),
    re_path(
        r'^products/recommendations$',
        views.ListRecommendations.as_view(),
        name='list_recommendations'
    ),
    re_path(
        r'^liked$',
        views.LikedProductsView.as_view(),
        name='list_liked_products'
    ),
    re_path(
        r'^products$',
        views.ListProducts.as_view(),
        name='list_products'
    )
]

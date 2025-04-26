from django.urls import re_path
from shop.api import views

app_name = 'shop_api'

urlpatterns = [
    # re_path(
    #     r'^fuzzy$',
    #     views.test_fuzzy,
    #     name='fuzzy'
    # ),
    re_path(
        r'^products/(?P<pk>\d+)$',
        views.GetProduct.as_view(),
        name='product'
    ),
    re_path(
        r'^products/sales$',
        views.ListProductsOnSale.as_view(),
        name='sales'
    ),
    re_path(
        r'^products/new$',
        views.ListNewProducts.as_view(),
        name='new'
    ),
    re_path(
        r'^products/recommendations$',
        views.ListRecommendations.as_view(),
        name='recommendations'
    ),
    re_path(
        r'^wishlist$',
        views.ListWishlist.as_view(),
        name='wishlist'
    ),
    re_path(
        r'^products$',
        views.ListProducts.as_view(),
        name='products'
    )
]

from django.urls import re_path
from rest_framework.routers import DefaultRouter

from api.views import carts, orders, products, auth

app_name = 'api'

router = DefaultRouter()
# router.register('wishlist', products.WishlistView)

urlpatterns = [    
    re_path(r'^profile', auth.profile_view),
    re_path(r'^login', auth.login_view),
    
    re_path(r'^wishlists/(?P<pk>\d+)/add', products.add_to_wishlist_view),
    re_path(r'^wishlists/create', products.create_whishlist_view),
    re_path(r'^wishlists', products.whishlists_view),
    
    re_path(r'^products/(?P<pk>\d+)/variants', products.product_variants_view),
    re_path(r'^products/(?P<pk>\d+)/like', products.add_liked_view),
    re_path(r'^products/(?P<product_id>\d+)/reviews', products.reviews),
    re_path(r'^products$', products.products_view),
    
    re_path(r'^likes', products.liked_products_view),
    re_path(r'^orders', orders.my_orders_view),
    re_path(r'^payment', orders.create_order),
    
    re_path(r'^cart/delete', carts.delete_from_cart_view),
    re_path(r'^cart/update', carts.update_in_cart_view),
    re_path(r'^cart/add', carts.add_to_cart_view),
    re_path(r'^cart', carts.cart_view)
]

urlpatterns += router.urls

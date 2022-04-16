from django.urls import re_path

from shop import views

api_name = 'shop'

urlpatterns = [
    re_path(r'^dashboard/products/(?P<pk>\d+)', views.dashboard_product_view),
    
    re_path(r'^advanced/search', views.advanced_search_view),
    re_path(r'^search', views.search_view),
    
    re_path(r'^wishlists/create', views.create_whishlist_view),
    re_path(r'^wishlists/(?P<pk>\d+)/remove', views.remove_from_list_view),
    re_path(r'^wishlists/(?P<pk>\d+)/add', views.add_to_list_view),
    re_path(r'^wishlists/(?P<pk>\d+)', views.whishlist_details_view),
    re_path(r'^wishlists', views.list_whishlists_view),
    
    re_path(r'^likes/remove', views.remove_liked_product_view),
    re_path(r'^likes', views.liked_products_view),
    
    re_path(r'^products/(?P<pk>\d+)/like', views.like_product_view),
    re_path(r'^products/(?P<pk>\d+)', views.product_details_view),
    re_path(r'^products', views.products_view)
]

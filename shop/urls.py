from django.urls import re_path, include
from rest_framework.routers import DefaultRouter
from shop import views

app_name = 'shop'

router = DefaultRouter()
router.register('images', views.ProductImagesView)

dashboard_patterns = [
    re_path(r'^categories', views.query_categories),
    re_path(r'^products/(?P<method>(activate|deactivate))', views.dashboard_toggle_product_state),
    re_path(r'^products/(?P<pk>\d+)/images/dissociate', views.dissociate_images_from_product),
    re_path(r'^products/(?P<pk>\d+)/images/associate', views.associate_images_to_product),
    re_path(r'^products/(?P<pk>\d+)/update', views.update_product_view),
    re_path(r'^products/(?P<pk>\d+)', views.dashboard_product_details_view),
    re_path(r'^products', views.generic_products_view)
]

dashboard_patterns += router.urls

urlpatterns = [
    re_path(r'^dashboard/', include((dashboard_patterns, app_name), namespace='dashboard')),
    
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

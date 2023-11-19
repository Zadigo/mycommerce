from django.urls import include, re_path
from rest_framework.routers import DefaultRouter

from shop import api_views

router = DefaultRouter()
router.register('images', api_views.ProductImagesView)

dashboard_patterns = [
    re_path(r'^categories', api_views.query_categories),
    re_path(r'^products/(?P<method>(activate|deactivate))',
            api_views.dashboard_toggle_product_state),
    re_path(r'^products/(?P<pk>\d+)/images/dissociate',
            api_views.dissociate_images_from_product),
    re_path(r'^products/(?P<pk>\d+)/images/associate',
            api_views.associate_images_to_product),
    re_path(r'^products/(?P<pk>\d+)/update', api_views.update_product_view),
    re_path(r'^products/(?P<pk>\d+)', api_views.dashboard_product_details_view),
    re_path(r'^products', api_views.generic_products_view),
    re_path(r'^statistics', api_views.shop_statistics)
]

dashboard_patterns += router.urls

urlpatterns = [
    re_path(r'^dashboard/',
            include((dashboard_patterns, 'shop'),
                    namespace='dashboard')
            ),

    re_path(r'^latest', api_views.latest_products),

    re_path(r'^advanced/search', api_views.advanced_search_view),
    re_path(r'^search', api_views.search_view),

    re_path(r'^wishlists/(?P<pk>\d+)/remove', api_views.remove_from_list_view),
    re_path(r'^wishlists/(?P<pk>\d+)/add', api_views.add_to_list_view),
    re_path(r'^wishlists/(?P<pk>\d+)', api_views.whishlist_details_view),
    re_path(r'^wishlists/create', api_views.create_whishlist_view),
    re_path(r'^wishlists', api_views.list_whishlists_view),

    re_path(r'^likes', api_views.liked_products_view),

    re_path(r'^products/(?P<pk>\d+)/unlike',
            api_views.remove_liked_product_view),
    re_path(r'^products/(?P<pk>\d+)/like', api_views.like_product_view),
    re_path(r'^products/(?P<pk>\d+)', api_views.product_details_view),
    re_path(r'^products', api_views.products_view)
]

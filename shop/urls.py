from django.urls import re_path

from shop import views

api_name = 'shop'

urlpatterns = [
    re_path(r'^dashboard/products/(?P<pk>\d+)', views.dashboard_product_view),
    
    re_path(r'^advanced/search', views.advanced_search_view),
    re_path(r'^search', views.search_view),
    re_path(r'^products/(?P<pk>\d+)', views.product_details_view),
    re_path(r'^products$', views.products_view)
]

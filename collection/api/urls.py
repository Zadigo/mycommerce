from django.urls import re_path

from collection.api import views

urlpatterns = [
    re_path(
        r'^(?P<name>[a-z\-]+)',
        views.list_collection_products
    ),
    re_path(
        r'^(?P<pk>\d+)/search$',
        views.search_collection_products
    ),
    re_path(
        r'^$',
        views.list_collections
    )
]

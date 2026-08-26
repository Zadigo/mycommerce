from django.urls import re_path

from collection.api import views

app_name = 'collection_api'

urlpatterns = [
    re_path(
        r'^(?P<name>[a-z\-]+)',
        views.ListCollectionProducts.as_view(),
        name='collection_products'
    ),
    re_path(
        r'^$',
        views.ListCollections.as_view(),
        name='collections'
    )
]

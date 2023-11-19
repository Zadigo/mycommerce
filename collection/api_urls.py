from django.urls import re_path

from collection import api_views

urlpatterns = [
    re_path(r'^(?P<name>[a-z\-]+)', api_views.collection_view),
    re_path(r'^(?P<pk>\d+)/search$', api_views.search_view),
    re_path(r'^$', api_views.collection_names_view)
]

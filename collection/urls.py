from django.urls import re_path

from collection.views import collecion_view

urlpatterns = [
    re_path(r'^(?P<name>\w+)', collecion_view)
]

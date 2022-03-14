from django.urls import re_path
from rest_framework.routers import DefaultRouter

from collection.views import collecion_view

# router = DefaultRouter()
# router.register('collection', CollectionView)

urlpatterns = [
    re_path(r'^(?P<name>\w+)', collecion_view)
]

# urlpatterns += router.urls

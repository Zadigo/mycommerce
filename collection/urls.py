from django.urls import re_path

from collection import views

app_name = 'collection'

urlpatterns = [
    re_path(
        r'^(?P<slug>[a-z\-]+)/(?P<sub_category>[a-z\-]+)$',
        views.CollectionSubcategoryView.as_view(),
        name='sub_category'
    ),
    re_path(
        r'^(?P<slug>[a-z\-]+)$',
        views.CollectionView.as_view(),
        name='detail'
    ),
    re_path(
        r'^$',
        views.CollectionsView.as_view(),
        name='list'
    )
]

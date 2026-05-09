from django.contrib import admin
from django.urls import path, include, re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    re_path(
        'api/schema/',
        SpectacularAPIView.as_view(),
        name='schema'
    ),
    re_path(
        'api/schema/swagger-ui/',
        SpectacularSwaggerView.as_view(),
        name='swagger-ui'
    ),
    re_path(
        'api/schema/redoc/',
        SpectacularRedocView.as_view(),
        name='redoc'
    ),
    path(
        'v1/reviews/',
        include('reviews.urls')
    ),
    path(
        'admin/',
        admin.site.urls
    )
]

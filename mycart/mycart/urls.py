from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from drf_spectacular import views as drf_views

urlpatterns = [
     path(
        'api/schema/',
        drf_views.SpectacularAPIView.as_view(),
        name='schema'
    ),
    path(
        'api/schema/swagger-ui/',
        drf_views.SpectacularSwaggerView.as_view(url_name='schema'),
        name='swagger-ui'
    ),
    path(
        'api/schema/redoc/',
        drf_views.SpectacularRedocView.as_view(url_name='schema'),
        name='redoc'
    ),
    path(
        'api/rest/',
        include('rest_framework.urls'),
        name='rest_framework'
    ),
    path(
        'auth/v1/token/verify/',
        jwt_views.TokenVerifyView.as_view(),
        name='token_verify'
    ),
    path(
        'auth/v1/token/',
        # EmailTokenObtainPairView.as_view(),
        jwt_views.TokenObtainPairView.as_view(),
        name='token_obtain_pair'
    ),
    path(
        'auth/v1/token/refresh/',
        jwt_views.TokenRefreshView.as_view(),
        name='token_refresh'
    ),
    path(
        'ckeditor5/',
        include('django_ckeditor_5.urls')
    ),
    path(
        'orders/v1/',
        include('orders.urls')
    ),
    path(
        'cart/v1/',
        include('cart.urls')
    ),
    path(
        'accounts/v1/',
        include('accounts.urls')
    ),
    path(
        'admin/', 
        admin.site.urls
    )
]

from django.conf import settings
from django.conf.urls import include
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from django.urls import path, re_path
from drf_spectacular import views as drf_views
from rest_framework_simplejwt import views as jwt_views

from mystore import views
from mystore.sitemaps import SITEMAPS

urlpatterns = [
    path(
        'sitemap.xml',
        sitemap,
        {'sitemaps': SITEMAPS},
        name='django.contrib.sitemaps.views.sitemap'
    ),
    path(
        '__debug__/',
        include('debug_toolbar.urls')
    ),
    path(
        'api/v1/admin/',
        include('adminapi.urls')
    ),
    path(
        'api/v1/stocks/',
        include('stocks.api.urls')
    ),
    path(
        'api/v1/orders/',
        include('orders.api.urls')
    ),
    path(
        'api/v1/accounts/',
        include('accounts.api.urls')
    ),
    path(
        'api/v1/shop/',
        include('shop.api.urls')
    ),
    path(
        'api/v1/cart/',
        include('cart.api.urls')
    ),
    path(
        'api/v1/collection/',
        include('collection.api.urls')
    ),
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
        'all-accounts/',
        include('allauth.urls')
    ),
    path('accounts/', include('accounts.urls')),
    path('admin/', admin.site.urls),
    path('legal/', include('legal.urls')),
    re_path(r'^$', views.HomeView.as_view(), name='home')
]


# handler404 = 'mycommerce.views.handler404'
# handler500 = 'mycommerce.views.handler500'


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
    urlpatterns += static(
        settings.STATIC_URL,
        document_root=settings.STATIC_ROOT
    )

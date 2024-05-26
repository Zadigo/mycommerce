from django.conf import settings
from django.conf.urls import include
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from django.urls import path, re_path

from mycommerce import views
from mycommerce.sitemaps import SITEMAPS

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
        'api/v1/accounts/',
        include('accounts.urls')
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

    re_path(r'^test', views.TestPage.as_view()),

    path('collection/', include('collection.urls')),
    path('shop/', include('shop.urls')),
    path('admin/', admin.site.urls),
    path('cart/', include('cart.urls')),
    path('legal/', include('legal.urls')),
    re_path(r'^$', views.HomeView.as_view(), name='home')
]


# handler404 = 'mycommerce.views.handler404'
# handler500 = 'mycommerce.views.handler500'


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)

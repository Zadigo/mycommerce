from django.conf import settings
from django.conf.urls import include
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, re_path

from mycommerce import views

urlpatterns = [
    path('api/v1/accounts/', include('accounts.urls')),
    path('api/v1/shop/', include('shop.urls')),
    path('api/v1/cart/', include('cart.urls')),
    path('api/v1/collection/', include('collection.urls')),
    
    # path('api/v1/', include('api.urls')),
    path('admin/', admin.site.urls),
    
    re_path(r'^$', views.index_view, name='home')
]


# handler404 = 'mycommerce.views.handler404'
# handler500 = 'mycommerce.views.handler500'


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

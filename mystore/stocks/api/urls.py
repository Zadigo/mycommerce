from django.urls.conf import re_path

from stocks.api import views

app_name = 'stock_api'

urlpatterns = [
    re_path(
        r'^products/(?P<pk>\d+)$',
        views.GetProductStockStatus.as_view(),
        name='product'
    ),
    re_path(
        r'^update$',
        views.UpdateStockStatus.as_view(),
        name='update'
    )
]

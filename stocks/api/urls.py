from django.urls.conf import re_path

from stocks.api import views

app_name = 'stock_api'


urlpatterns = [
    re_path(
        r'^products/(?P<pk>\d+)/status',
        views.get_product_stock_status
    )
]

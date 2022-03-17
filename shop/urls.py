from django.urls import re_path

from shop import views

api_name = 'shop'

urlpatterns = [
    re_path(r'^products$', views.products_view)
]

from django.urls import re_path
from accounts.api import views

app_name = 'accounts_api'

urlpatterns = [
    re_path(r'^profile', views.profile),
    re_path(r'^logout', views.logout),
    re_path(r'^login', views.login),
]

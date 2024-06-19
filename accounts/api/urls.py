from django.urls import re_path
from accounts.api import views

app_name = 'accounts'

urlpatterns = [
    re_path(r'^profile', views.profile_view),
    re_path(r'^logout', views.logout_view),
    re_path(r'^login', views.login_view),
]

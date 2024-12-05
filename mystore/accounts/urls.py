from accounts import views
from django.urls import re_path

app_name = 'accounts'

urlpatterns = [
    re_path(
        r'^logout$',
        views.LogoutView.as_view(),
        name='logout'
    ),
    re_path(
        r'^login',
        views.LoginView.as_view(),
        name='login'
    )
]

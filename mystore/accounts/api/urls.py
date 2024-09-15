from django.urls import re_path
from accounts.api import views

app_name = 'accounts_api'

urlpatterns = [
    re_path(
        r'^addresses/(?P<pk>\d+)/update$',
        views.UpdateAddressesView.as_view(),
        name='update_address'
    ),
    re_path(
        r'^profile$',
        views.ProfileView.as_view(),
        name='profile'
    ),
    re_path(
        r'^update$',
        views.AccountUpdate.as_view(),
        name='update_account'
    ),
    re_path(
        r'^logout$',
        views.logout,
        name='logout'
    ),
    re_path(
        r'^login$',
        views.Login.as_view(),
        name='login'
    )
]

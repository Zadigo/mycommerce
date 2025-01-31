from accounts.api import views
from django.urls import re_path

app_name = 'accounts_api'

urlpatterns = [
    re_path(
        r'^(?P<pk>\d+)$',
        views.UserInfo.as_view(),
        name='user'
    ),
    re_path(
        r'(?P<pk>\d+)/address-lines$',
        views.AddressLines.as_view(),
        name='addresses'
    ),
    re_path(
        r'^signup$',
        views.Signup.as_view(),
        name='signup'
    )
]

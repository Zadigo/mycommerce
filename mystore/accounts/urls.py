from accounts import views
from django.urls import re_path

app_name = 'accounts'

urlpatterns = [
    re_path(
        '^signup-success$', 
        views.SignupSuccessView.as_view(), 
        name='success'
    ),
    re_path(
        '^signup$', 
        views.SignupView.as_view(), 
        name='signup'
    )
]

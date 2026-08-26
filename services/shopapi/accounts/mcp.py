from accounts.models import Address, UserProfile
from django.contrib.auth import get_user_model
from mcp_server import MCPToolset, ModelQueryToolset
from accounts.api import serializers


class UserQueryTool(ModelQueryToolset):
    model = get_user_model()
    search_fields = [
        'first_name',
        'last_name',
        'email',
    ]


class AddressQueryTool(ModelQueryToolset):
    model = Address
    search_fields = [
        'firstname',
        'lastname',
        'userprofile__user__email',
        'address_line',
        'zip_code',
        'country',
        'city',
        'telephone'
    ]

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.select_related('user_profile')


class UserProfileQueryTool(ModelQueryToolset):
    model = UserProfile
    search_fields = [
        'user__first_name',
        'user__last_name',
        'user__email',
        'stripe_id'
    ]


class UserTools(MCPToolset):
    def get_user_by_email(self, email: str):
        """"""
        user = get_user_model().objects.get(email=email)
        return serializers.UserSerializer(instance=user).data

    def email_user(self, user_id: int, subject: str, message: str):
        pass

    def get_user_emails(self, email: str):
        pass

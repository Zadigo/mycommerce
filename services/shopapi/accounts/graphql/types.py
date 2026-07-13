from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType

from accounts.models import UserProfile


class UserProfileType(DjangoObjectType):
    class Meta:
        model = UserProfile
        fields = ['id', 'stripe_id', 'telephone']


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser']

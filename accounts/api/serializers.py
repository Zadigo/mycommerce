from django.contrib.auth import get_user_model, login, update_session_auth_hash
from django.contrib.auth.password_validation import validate_password
from django.shortcuts import get_object_or_404
from rest_framework import fields
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.serializers import Serializer

USER_MODEL = get_user_model()


def password_validator(value):
    validate_password(value)
    return value


class LoginUserSerializer(Serializer):
    email = fields.EmailField()
    password = fields.CharField()

    def save(self, request, **kwargs):
        email = self.validated_data['email']
        password = self.validated_data['password']

        user = get_object_or_404(USER_MODEL, email=email)
        result = user.check_password(password)
        if not result:
            raise AuthenticationFailed(detail='Could not authenticate user')

        instance = super().save(**kwargs)
        serializer = UserSerializer(instance=user)
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        return {'token': instance.key, 'user': serializer.data}

    def create(self, validated_data):
        instance, state = Token.objects.get_or_create(
            user__email=validated_data['email']
        )
        return instance


class SignupUserSerializer(LoginUserSerializer):
    name = fields.CharField()
    password = None
    password1 = fields.CharField()
    password2 = fields.CharField()

    def save(self, request, **kwargs):
        pass


class AccountMixin:
    def get_object(self):
        return get_object_or_404(USER_MODEL, id=self.validated_data['id'])


class UserProfileSerializer(AccountMixin, Serializer):
    id = fields.IntegerField()

    def save(self, request, **kwargs):
        user = self.get_object()


class UserSerializer(AccountMixin, Serializer):
    id = fields.CharField(read_only=True)
    userprofile = UserProfileSerializer()
    first_name = fields.CharField(allow_null=True)
    last_name = fields.CharField(allow_null=True)
    get_full_name = fields.CharField(required=False)
    username = fields.CharField(allow_null=True)
    email = fields.CharField(allow_null=True)
    # telephone = fields.CharField(allow_null=True)

    # TODO: Remove
    def save(self, request, **kwargs):
        user = self.get_object()

        user.username = self.validated_data['username']
        user.email = self.validated_data['email']
        user.save()

        password = self.validated_data.get('password', None)
        if password is not None:
            user.set_password(user.check_password(password))
            update_session_auth_hash(request, user)

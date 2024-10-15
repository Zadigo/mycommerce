from accounts.models import Address
from accounts.validators import check_password_validator
from django.contrib.auth import get_user_model, login
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import inline_serializer
from rest_framework import fields
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.serializers import Serializer
from rest_framework_simplejwt.serializers import TokenObtainSerializer

USER_MODEL = get_user_model()


class LoginUserSerializer(Serializer):
    email = fields.EmailField()
    password = fields.CharField()

    def __init__(self, **kwargs):
        self._token_cache = None
        super().__init__(**kwargs)

    @property
    def get_serializer_data(self):
        request = self._context['request']
        user_serializer = UserSerializer(instance=request.user)
        return {'token': self._token_cache.key, 'user': user_serializer.data}

    def create(self, validated_data):
        request = self._context['request']
        email = validated_data['email']
        password = validated_data['password']

        user = get_object_or_404(USER_MODEL, email=email)
        result = user.check_password(password)
        if not result:
            raise AuthenticationFailed(**{
                'detail': 'Could not authenticate user'
            })

        login(request, user, backend='django.contrib.auth.backends.ModelBackend')

        instance, state = Token.objects.get_or_create(
            defaults={'user': user},
            user__email=validated_data['email']
        )
        self._token_cache = instance
        return instance.user


class SignupUserSerializer(Serializer):
    username = fields.CharField()
    email = fields.EmailField()
    password1 = fields.CharField(validators=[check_password_validator])
    password2 = fields.CharField(validators=[check_password_validator])

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise ValidationError(detail={
                'password1': 'Password do not match',
                'password2': 'Password do not match',
            })

        fake_emails = []
        if attrs['email'] in fake_emails:
            raise ValidationError(detail={
                'email': 'Email does not have a valid domain'
            })

        return attrs

    def create(self, validated_data):
        user = USER_MODEL.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password1']
        )
        return user


class AddressSerializer(Serializer):
    id = fields.IntegerField()
    firstname = fields.CharField()
    lastname = fields.CharField()
    address_line = fields.CharField()
    zip_code = fields.IntegerField()
    country = fields.CharField()
    city = fields.CharField()
    telephone = fields.CharField()
    gender = fields.CharField()
    is_active = fields.BooleanField(default=False)
    created_on = fields.DateTimeField()


class UserProfileSerializer(Serializer):
    id = fields.IntegerField()
    stripe_id = fields.CharField()
    address_set = AddressSerializer(many=True)


class UserSerializer(Serializer):
    id = fields.CharField(read_only=True)
    userprofile = UserProfileSerializer()
    first_name = fields.CharField()
    last_name = fields.CharField()
    get_full_name = fields.CharField()
    username = fields.CharField()
    email = fields.CharField()


class ValidateUpdateAccount(Serializer):
    email = fields.EmailField(
        allow_null=True
    )
    password1 = fields.CharField(
        validators=[check_password_validator]
    )
    password2 = fields.CharField(
        validators=[check_password_validator]
    )

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise ValidationError(detail={
                'password1': 'Password do not match',
                'password2': 'Password do not match',
            })
        return attrs


class ValidateAddressSerializer(Serializer):
    firstname = fields.CharField()
    lastname = fields.CharField()
    address_line = fields.CharField()
    zip_code = fields.IntegerField()
    country = fields.CharField()
    city = fields.CharField()
    telephone = fields.CharField(allow_null=True)
    gender = fields.IntegerField()
    is_active = fields.BooleanField(default=False)

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance

    def create(self, validated_data):
        request = self._context['request']

        instance = Address.objects.create(
            user_profile=request.user.user_profile,
            **validated_data
        )
        return instance


LOGIN_RESPONSE_SERIALIZER = inline_serializer(
    'Login',
    {
        'token': fields.CharField(),
        'user': {
            'email': fields.EmailField()
        }
    }
)


class EmailTokenObtainSerializer(TokenObtainSerializer):
    """Custom token seralizer used to substitute the
    user name field by email for JWT authentication"""

    username_field = 'email'

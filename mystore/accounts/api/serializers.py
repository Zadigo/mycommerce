from accounts import tasks
from accounts.models import Address
from accounts.validators import check_password_validator
from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string
from drf_spectacular.utils import inline_serializer
from rest_framework import fields
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import Serializer
from rest_framework_simplejwt.serializers import TokenObtainSerializer
from django.contrib.auth import password_validation

USER_MODEL = get_user_model()


class AddressSerializer(Serializer):
    id = fields.IntegerField(read_only=True)
    firstname = fields.CharField()
    lastname = fields.CharField()
    address_line = fields.CharField()
    zip_code = fields.IntegerField()
    country = fields.CharField()
    city = fields.CharField()
    telephone = fields.CharField()
    gender = fields.CharField()
    is_active = fields.BooleanField(default=False)
    created_on = fields.DateTimeField(read_only=True)

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance

    def create(self, validated_data):
        request = self._context['request']
        return Address.objects.create(
            user_profile=request.user.userprofile,
            **validated_data
        )


class UserProfileSerializer(Serializer):
    id = fields.IntegerField()
    stripe_id = fields.CharField()
    address_set = AddressSerializer(many=True)


class UserSerializer(Serializer):
    id = fields.CharField(read_only=True)
    userprofile = UserProfileSerializer(read_only=True)
    firstname = fields.CharField(write_only=True)
    lastname = fields.CharField(write_only=True)
    email = fields.EmailField(write_only=True)
    password1 = fields.CharField(write_only=True)
    password2 = fields.CharField(write_only=True)
    username = fields.CharField(write_only=True, allow_null=True)

    def validate(self, attrs):
        username = attrs.get('username')
        if username is None:
            attrs['username'] = f'user_{get_random_string(length=12)}'

        password1 = attrs.get('password1')
        password2 = attrs.get('password2')

        if password1 != password2:
            raise ValidationError(
                detail={'password': 'Passwords do not match'})

        if password1 is None:
            raise ValidationError(detail={'password': 'Password is not valid'})

        password_validation.validate_password(password1)

        return attrs

    def create(self, validated_data):
        instance = get_user_model().objects.create_user(**{
            'username': validated_data['username'],
            'password': validated_data['password1'],
            'email': validated_data['email'],
            'first_name': validated_data['firstname'],
            'last_name': validated_data['lastname']
        })

        tasks.signup_workflow.apply_async(
            args=[instance.email],
            countdown=30
        )
        # tasks.signup_workflow.s(instance.email)
        return instance


class UpdateUserSerializer(Serializer):
    id = fields.IntegerField(read_only=True)
    firstname = fields.CharField(write_only=True)
    lastname = fields.CharField(write_only=True)
    telephone = fields.CharField(write_only=True, allow_null=True)

    def update(self, instance, validated_data):
        skip = ['telephone']

        for key, value in validated_data.items():
            if key in skip:
                continue

            if key == 'firstname':
                setattr(instance, 'first_name', value)
                continue
            
            if key == 'lastname':
                setattr(instance, 'last_name', value)
                continue

            setattr(instance, key, value)
        instance.save()

        for key in skip:
            setattr(instance.userprofile, key, validated_data[key])
        
        instance.userprofile.save()

        tasks.update_profie.apply_async(
            args=[instance.email],
            countdown=30
        )

        return instance


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

from accounts.models import Address
from django.contrib.auth import get_user_model, password_validation
from django.utils.crypto import get_random_string
from rest_framework import fields
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer, Serializer
from rest_framework_simplejwt.serializers import TokenObtainSerializer


class AddressSerializer(ModelSerializer):
    created_on = fields.DateTimeField(read_only=True)

    class Meta:
        model = Address
        fields = [
            'id', 'firstname', 'lastname', 'address_line', 'zip_code',
            'country', 'city', 'telephone', 'gender', 'is_active', 'created_on'
        ]

    def validate(self, attrs):
        request = self._context['request']
        attrs['user_profile'] = request.user.userprofile
        return attrs


class UserProfileSerializer(Serializer):
    address_set = AddressSerializer(read_only=True, many=True)
    has_payment_method = fields.BooleanField(read_only=True)

    class Meta:
        fields = [
            'id', 'address_set',
            'telephone', 'has_payment_method'
        ]


class UserSerializer(ModelSerializer):
    userprofile = UserProfileSerializer(read_only=True)

    class Meta:
        model = get_user_model()
        fields = [
            'id', 'first_name', 'last_name',
            'email', 'username', 'userprofile'
        ]


class UserRegistrationSerializer(ModelSerializer):
    password1 = fields.CharField(write_only=True, required=True)
    password2 = fields.CharField(write_only=True, required=True)

    class Meta:
        model = get_user_model()
        fields = ['email', 'password1', 'password2']

    def validate_username(self, value):
        qs = get_user_model().objects.filter(username=value)
        if qs.exclude(pk=self.instance.pk).exists():
            raise ValidationError('This username is already taken')
        return value

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
            'first_name': '',
            'last_name': ''
        })

        # t1 = tasks.signup_workflow.apply_async(
        #     args=[instance.email],
        #     countdown=30
        # )
        # t1.get()
        # tasks.signup_workflow.s(instance.email)
        return instance


class UpdateUserSerializer(ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['first_name', 'last_name', 'email']
        extra_kwargs = {
            'username': {'required': False},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'email': {'required': False}
        }

    def validate(self, attrs):
        if not attrs.get('username'):
            attrs['username'] = self.instance.username

        if not attrs.get('email'):
            attrs['email'] = self.instance.email

        return attrs


class EmailTokenObtainSerializer(TokenObtainSerializer):
    """Custom token seralizer used to substitute the
    user name field by email for JWT authentication"""

    username_field = 'email'

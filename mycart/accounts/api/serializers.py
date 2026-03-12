from accounts.models import Address
from django.contrib.auth import get_user_model
from rest_framework import fields
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
    """Serializer used to register a new user"""

    username = fields.CharField()
    password1 = fields.CharField(write_only=True, required=True)
    password2 = fields.CharField(write_only=True, required=True)

    class Meta:
        model = get_user_model()
        fields = ['username', 'email', 'password1', 'password2']

    def create(self, validated_data):
        instance = get_user_model().objects.create_user(**{
            'username': validated_data['username'],
            'password': validated_data['password1'],
            'email': validated_data['email'],
            'first_name': '',
            'last_name': ''
        })
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


class AuthenticateUserSerializer(Serializer):
    """Serializer used to authenticate a user
    based on email and password credentials"""

    email = fields.EmailField(required=True)
    password = fields.CharField(required=True, write_only=True)

    def create(self, validated_data):
        return super().create(validated_data)

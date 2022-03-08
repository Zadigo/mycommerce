from django.contrib.auth import (authenticate, get_user_model, login,
                                 update_session_auth_hash)
from django.contrib.auth.password_validation import validate_password
from django.shortcuts import get_object_or_404
from rest_framework import fields, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.serializers import Serializer

USER_MODEL = get_user_model()


def password_validator(value):
    validate_password(value)
    return value


class LoginUserSerializer(Serializer):
    email = fields.EmailField()
    password = fields.CharField()
    
    def get_response(self, data):
        return Response(data=data)
    
    def save(self, request, **kwargs):
        email = self.validated_data['email']
        password = self.validated_data['password']
        
        user = get_object_or_404(USER_MODEL, email=email)
        result = user.check_password(password)
        if not result:
            return Response(data={'status': False})
        
        login(request, user)
        token, state = Token.objects.get_or_create(user=user)
        serializer = UserProfileSerializer(instance=user)
        return self.get_response({ 'token': token.key, 'user': serializer.data })


class SignupUserSerializer(LoginUserSerializer):
    name = fields.CharField()
    password1 = fields.CharField()
    password2 = fields.CharField()
    password = fields.CharField(validators=[password_validator])


class UserProfileSerializer(Serializer):
    """Serializer the main user profile"""
    id = fields.CharField(read_only=True)
    first_name = fields.CharField(allow_null=True)
    last_name = fields.CharField(allow_null=True)
    get_full_name = fields.CharField(allow_null=True)
    username = fields.CharField(allow_null=True)
    email = fields.CharField(allow_null=True)
    # telephone = fields.CharField(allow_null=True)
    
    def save(self, request, **kwargs):
        user = get_object_or_404(USER_MODEL, id=self.validated_data['id'])
        user.username = self.validated_data['username']
        user.email = self.validated_data['email']
        user.save()
        if self.validated_data['password']:
            user.set_password(user.check_password(self.validated_data['password']))
            update_session_auth_hash(request, user)
        user.username = self.validated_data['username']
        

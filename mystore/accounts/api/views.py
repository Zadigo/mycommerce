from accounts.api.serializers import (LOGIN_RESPONSE_SERIALIZER, USER_MODEL, LoginUserSerializer,
                                      SignupUserSerializer, UserSerializer,
                                      ValidateAddressSerializer,
                                      ValidateUpdateAccount)
from accounts.models import Address
from django.shortcuts import get_object_or_404
from drf_spectacular.extensions import OpenApiViewExtension
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import APIView, api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.generics import CreateAPIView, UpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response


@extend_schema('Login', responses=LOGIN_RESPONSE_SERIALIZER)
class Login(CreateAPIView):
    """Logs the user in using standard username
    and password data
    """

    serializer_class = LoginUserSerializer
    permission_classes = [AllowAny]

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs.setdefault('context', self.get_serializer_context())
        return serializer_class(self.request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(*args, data=request.data, **kwargs)
        serializer.is_valid(raise_exception=True)

        user = self.perform_create(serializer)

        user_serializer = UserSerializer(instance=user)
        data = {
            'token': serializer._token_cache.key,
            'user': user_serializer.data
        }
        headers = self.get_success_headers(data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        return serializer.save()


class Signup(APIView):
    http_method_names = ['post']
    serializer_class = SignupUserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_authenticate_header(request)
        return Response({'email': serializer.data['email']}, headers=headers)


class AccountUpdate(APIView):
    http_method_names = ['post']
    serializer_class = ValidateUpdateAccount
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        state = self.request.user.check_password(
            serializer.validated_data['password1']
        )
        # If the new password match the old password
        # raise a validation error
        if state:
            raise ValidationError(
                detail={
                    'password1': (
                        "The new password matches your previous "
                        "password. They should not be similar"
                    )
                },
                code=status.HTTP_400_BAD_REQUEST
            )
        else:
            self.request.user.set_password(
                serializer.validated_data['password1'])
            self.request.user.auth_token.delete()

        headers = self.get_authenticate_header(request)
        return Response({'state': True}, headers=headers)


class UpdateAddress(UpdateAPIView):
    http_method_names = ['patch']
    queryset = Address.objects.all()
    serializer_class = ValidateAddressSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        serializer = self.serializer_class(
            request=self.request,
            instance=self.get_object(),
            data=self.request.data,
            partial=partial
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(user_profile__user=self.request.user)


@api_view(['post'])
@permission_classes([AllowAny])
def login(request, **kwargs):
    serializer = LoginUserSerializer(request, data=request.data)
    serializer.is_valid(raise_exception=True)
    # return Response(serializer.save(request))
    return Response(data=serializer.get_serializer_data)


class LoginAPIView(OpenApiViewExtension):
    target_class = 'oscarapi.views.checkout.UserAddressDetail'

    def view_replacement(self):
        class Login(self.target_class):
            queryset = USER_MODEL.objects.none()
        return Login


@api_view(['post'])
@permission_classes([IsAuthenticated])
def logout(request, **kwargs):
    user = get_object_or_404(USER_MODEL, id=request.user.id)
    user.auth_token.delete()
    return Response({'state': True})


def signup(request, **kwargs):
    pass


@api_view(['get'])
@permission_classes([IsAuthenticated])
def profile(request, **kwargs):
    serializer = UserSerializer(instance=request.user)
    return Response(serializer.data)

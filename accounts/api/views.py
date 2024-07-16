from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from accounts.api.serializers import (USER_MODEL, LoginUserSerializer,
                                      UserSerializer)
from rest_framework.generics import CreateAPIView

# class Login(CreateAPIView):
#     """Logs the user in using standard username
#     and password data
#     """

#     http_method_names = ['post']
#     serializer_class = LoginUserSerializer
#     permission_classes = [AllowAny]

#     def create(self, request, *args, **kwargs):
#         serializer = self.serializer_class(data=self.request.data)
#         serializer.is_valid(raise_exception=True)
#         data = self.perform_create(serializer)
#         headers = self.get_success_headers(serializer.data)
#         return Response(data, status=status.HTTP_201_CREATED, headers=headers)

#     def perform_create(self, serializer):
#         return serializer.save()


@api_view(['post'])
def login(request, **kwargs):
    serializer = LoginUserSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response(serializer.save(request))


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

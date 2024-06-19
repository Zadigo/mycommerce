from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.api.serializers import LoginUserSerializer, UserSerializer, USER_MODEL
from mycommerce.responses import simple_api_response



@api_view(['post'])
def login_view(request, **kwargs):
    serializer = LoginUserSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return simple_api_response(serializer.save(request))


@api_view(['post'])
def logout_view(request, **kwargs):
    """Used to log the user out"""
    user = get_object_or_404(USER_MODEL, id=request.user.id)
    user.auth_token.delete()
    return Response({'state': True})


def signup(request, **kwargs):
    pass


@api_view(['get'])
@permission_classes([IsAuthenticated])
def profile_view(request, **kwargs):
    serializer = UserSerializer(instance=request.user)
    return simple_api_response(serializer)

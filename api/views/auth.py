from django.contrib.auth import authenticate, get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from api.serializers.auth import LoginUserSerializer, UserProfileSerializer
from mycommerce.responses import simple_api_response

USER_MODEL = get_user_model()

@api_view(['post'])
def login_view(request, **kwargs):
    serializer = LoginUserSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return serializer.save(request)


@api_view(['post'])
@permission_classes([IsAuthenticated])
def logout_view(request, **kwargs):
    user = get_object_or_404(USER_MODEL, id=request.user.id)
    user.auth_token.delete()
    return simple_api_response({'state': True})


@api_view(['get'])
@permission_classes([IsAuthenticated])
def profile_view(request, **kwargs):
    serializer = UserProfileSerializer(instance=request.user)
    return Response(data=serializer.data)

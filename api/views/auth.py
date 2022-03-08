from django.contrib.auth import authenticate, get_user_model
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from api.serializers.auth import LoginUserSerializer, UserProfileSerializer

@api_view(['post'])
def login_view(request, **kwargs):
    serializer = LoginUserSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return serializer.save(request)


@api_view(['get'])
@permission_classes([IsAuthenticated])
def profile_view(request, **kwargs):
    serializer = UserProfileSerializer(instance=request.user)
    return Response(data=serializer.data)

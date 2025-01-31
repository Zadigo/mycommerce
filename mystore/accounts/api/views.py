from accounts.api import serializers
from accounts.models import Address
from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response


class UserInfo(generics.GenericAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, **kwargs):
        serializer = self.get_serializer(instance=request.user)
        return Response(serializer.data)


class AddressLines(generics.ListAPIView, generics.UpdateAPIView, generics.CreateAPIView):
    queryset = Address.objects.all()
    serializer_class = serializers.AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user_profile__user=self.request.user)


class Signup(generics.CreateAPIView):
    """This enpoint is used to created a user by
    email via the frontend (either by email or by
    Google OAuth)"""

    queryset = get_user_model().objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = [AllowAny]

from accounts.api import serializers
from accounts.models import Address
from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response


class UserInfo(generics.RetrieveUpdateAPIView):
    """Updates and/or returns information on the user"""

    queryset = get_user_model().objects.all()
    serializer_class = serializers.UpdateUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = serializers.UserSerializer(instance=user)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        super().update(request, *args, **kwargs)
        return self.retrieve(request, *args, **kwargs)


class AddressLines(generics.ListAPIView, generics.CreateAPIView):
    queryset = Address.objects.all()
    serializer_class = serializers.AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_queryset(self):
        return self.queryset.filter(user_profile__user=self.request.user)


class UpdateAddressLine(generics.UpdateAPIView):
    queryset = Address.objects.all()
    serializer_class = serializers.AddressSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'address_id'
    lookup_field = 'pk'


class Signup(generics.CreateAPIView):
    """This enpoint is used to created a user by
    email via the frontend (either by email or by
    Google OAuth)"""

    queryset = get_user_model().objects.all()
    serializer_class = serializers.UserRegistrationSerializer
    permission_classes = [AllowAny]

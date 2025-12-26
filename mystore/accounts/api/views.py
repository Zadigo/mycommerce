from datetime import timedelta

from accounts import tasks
from accounts.api import serializers
from accounts.models import Address
from accounts.permissions import CustomIsAuthenticated
from celery import chain
from django.contrib.auth import get_user_model
from django.db.models import F
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt import views as jwt_views
from rest_framework_simplejwt.tokens import RefreshToken


class UserInfo(generics.RetrieveUpdateAPIView):
    """Updates and/or returns information on the user
    and on additional thrid party interfaces like Stripe"""

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
        # Modified version that returns the the response
        # from the classic retrieve view
        # user = self.get_object()
        # tasks.update_profile.apply_async((user.email,), countdown=30)
        return self.retrieve(request, *args, **kwargs)


class AddressLines(generics.ListAPIView, generics.CreateAPIView):
    """Allows the user to create a set of addreses that can be
    used for delivering the products to his house"""

    queryset = Address.objects.all()
    serializer_class = serializers.AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_queryset(self):
        return self.queryset.filter(user_profile__user=self.request.user)

    def perform_create(self, serializer):
        super().perform_create(serializer)
        # tasks.update_profile.apply_async((self.request.user,), countdown=30)


class UpdateDestroyAddressLine(generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = Address.objects.all()
    serializer_class = serializers.AddressSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'address_id'
    lookup_field = 'pk'


class DestroyProfile(generics.DestroyAPIView):
    """Schedules an account to be deleted in the next time
    period specified below. First the account is deactivated
    and then scheduled to be deleted via Celery"""

    queryset = get_user_model().objects.filter(is_active=True)
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def perform_destroy(self, instance):
        if instance.active:
            date = timezone.now() + timedelta(days=5)
            instance.scheduled_deletion = date
            instance.active = ~F('active')


class Signup(generics.CreateAPIView):
    """This enpoint is used to created a user by
    email via the frontend (either by email or by
    Google OAuth)"""

    queryset = get_user_model().objects.all()
    serializer_class = serializers.UserRegistrationSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        return serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        response_serializer = serializers.UserSerializer(instance=instance)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class TokenObtainPair(jwt_views.TokenObtainPairView):
    def post(self, request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        # chain(
        #     tasks.signup_cart_api.apply_async(kwargs=request.data),
        #     tasks.signup_reviews_api.apply_async(kwargs=request.data)
        # )

        return Response(serializer.validated_data, status=status.HTTP_200_OK)

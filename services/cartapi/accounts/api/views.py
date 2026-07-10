from datetime import timedelta

from accounts.api import serializers
from accounts.models import Address
from django.contrib.auth import get_user_model
from django.db.models import F, Q
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request


class UserInfo(generics.RetrieveUpdateAPIView):
    """Updates and/or returns information on the user
    and on additional thrid party interfaces like Stripe"""

    queryset = get_user_model().objects.all()
    serializer_class = serializers.UpdateUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def retrieve(self, request: Request, *args, **kwargs):
        user = self.get_object()
        serializer = serializers.UserSerializer(instance=user)
        return Response(serializer.data)

    def update(self, request: Request, *args, **kwargs):
        super().update(request, *args, **kwargs)
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
    """Allows the user to update or delete an address line that can be
    used for delivering the products to his house"""

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


class RemoteLogin(generics.GenericAPIView):
    """Endpoint used to log in a user by email and password remotely (e.g. from a
    microservice like Golang). It is not called directly from the frontend but used an
    interface to ensure that the user is authenticated on this backend."""

    def post(self, request: Request, *args, **kwargs):
        email = request.data.get('email', '')
        username = request.data.get('username', '')
        password = request.data.get('password', '')

        try:
            logic = Q(username=username) | Q(email=email)
            user = get_user_model().objects.get(logic)
        except Exception as e:
            print(e)
            raise ValidationError('Account not recognized')
        else:
            if not user.is_active:
                raise ValidationError('Account not active')

            state = user.check_password(password)
            if not state:
                raise ValidationError(
                    'Combination of email or password not correct')

            if not user.is_active:
                raise ValidationError('Account not active')

            instance, _ = Token.objects.get_or_create(user=user)
            return Response({'access': instance.key}, status=status.HTTP_200_OK)


class Logout(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, *args, **kwargs):
        self.request.user.token.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

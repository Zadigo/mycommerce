from accounts.api import serializers
from accounts.models import Address
from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


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



class FirebaseAuthView(generics.APIView):
    """Endpoint used to authenticate both on
    Firebase and Django"""
    
    def create_token_for_user(user):
        """Creates JWT tokens for the given user"""
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    
    def post(self, request):
        # Get the ID token from the request
        id_token = request.data.get('idToken')

        try:
            # Verify the token
            decoded_token = auth.verify_id_token(id_token)
            firebase_uid = decoded_token['uid']

            # Find or create user
            user, created = get_user_model().objects.get_or_create(
                firebase_uid=firebase_uid,
                defaults={
                    'email': decoded_token.get('email', ''),
                    'username': decoded_token.get('email', '').split('@')[0],
                    # Set other fields
                }
            )

            # Return user data and Django auth token
            return Response({
                'user': serializers.UserSerializer(user).data,
                'token': self.create_token_for_user(user)
            })
        except Exception as e:
            return Response({'error': str(e)}, status=400)

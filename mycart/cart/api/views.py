from cart.api import serializers
from cart.api.serializers import (DeleteFromCartSerializer, ValidateCart,
                                  build_cart_response)
from cart.models import Cart
from cart.sessions import CartJWTGenerator
from django.conf import settings
from django.db.models import F, Q, QuerySet
from django.shortcuts import get_list_or_404, get_object_or_404
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import fields, generics, status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token


class CartMixin:
    def get_queryset(self):
        qs = Cart.objects.all()
        if self.request.user.is_authenticated:
            return qs.filter(user=self.request.user)
        return qs


class ListCartsView(generics.ListAPIView):
    """Returns all the carts in the current shop
    that were created by the users (authenticated
    and none authenticated ones)"""

    serializer_class = serializers.CartSerializer
    queryset = Cart.objects.all()
    permission_classes = [IsAuthenticated]


class ListCartView(generics.RetrieveAPIView):
    """Return all items that were saved
    in the specific user's cart"""

    permission_classes = [AllowAny]
    queryset = Cart.objects.all()
    lookup_url_kwarg = 'unique_id'
    lookup_field = 'session_id'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        return Response(instance.items)


class DeleteFromCart(generics.DestroyAPIView):
    """Delete a set of objects from the cart"""

    permission_classes = [AllowAny]
    serializer_class = ValidateCart
    queryset = Cart.objects.all()

    def destroy(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            raise NotFound(detail={
                'products': 'Products not found'
            })

        for item in queryset:
            self.perform_destroy(item)

        reevaluated_queryset = self.get_queryset()
        serializer = self.get_serializer(instance=reevaluated_queryset)
        return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)

    def get_queryset(self):
        queryset = super().get_queryset()

        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        logic = Q(session_id__exact=serializer.validated_data['session_id'])
        if self.request.user.is_authenticated:
            logic = logic & Q(user=self.request.user)

        return queryset.filter(logic)


class AddToCartView(generics.CreateAPIView):
    """Add a product to the cart. This allows the customer
    to add products being anonymous or logged in. In the
    first case, it returns a `session_id` used to identify
    the user and the list of products that were added to the
    cart for the given session"""

    serializer_class = ValidateCart
    permission_classes = [AllowAny]


class UpdateInCartView(CartMixin, generics.UpdateAPIView):
    """Update item in cart (quantity, size...)"""

    serializer_class = ValidateCart
    permission_classes = [AllowAny]
    lookup_url_kwarg = 'unique_id'
    lookup_field = 'session_id'


class DeleteFromCart(generics.GenericAPIView):
    """Delete one or multiple products
    from the user cart"""

    serializer_class = DeleteFromCartSerializer
    queryset = Cart.objects.all()

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.user.is_authenticated:
            return qs.filter(user=self.request.user)
        return qs

    def post(self, request, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.delete()

        session_id = serializer.validated_data['session_id']
        queryset = self.get_queryset().filter(session_id=session_id)
        data = build_cart_response(queryset, session_id)
        return Response(data)


class AuthenticateUserCart(generics.GenericAPIView):
    """Allows us to authenticate the items in the
    user's cart once they are logged in. This gets
    triggered only in the case where the user
    has started adding items when he was not
    authenticated and then authenticates for
    the payment process"""

    queryset = Cart.objects.all()
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print(request.headers)
        session_id = request.data.get('session_id', None)
        if session_id is not None and request.user.is_authenticated:
            queryset = super().get_queryset().filter(session_id=session_id)
            queryset.update(user=request.user, is_anonymous=~F('is_anonymous'))
            return Response(status=status.HTTP_200_OK)
        return Response({'error': 'Invalid session ID or user not authenticated'}, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(responses={201: inline_serializer(name='TokenSerializer', fields={'token': fields.CharField()})})
class CreateSessionID(generics.CreateAPIView):
    """Endpoint for creating a new session ID that
    allows us to identify anonymous users in the 
    database when they are shopping on the website.

    The main purpose of the token is to check whether a
    cart that a user has started is stale or not which
    then allows us to verify"""

    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        payload = {'user_id': None}

        if self.request.user.is_authenticated:
            payload['user_id'] = self.request.user.id

        instance = CartJWTGenerator(**payload)
        return Response({'token': instance.create()})

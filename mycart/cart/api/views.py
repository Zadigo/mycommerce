from cart.api import serializers
from cart.api.serializers import DeleteFromCartSerializer
from cart.models import Cart
from cart.sessions import CartJWTGenerator
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import fields, generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


class CartMixin:
    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.user.is_authenticated:
            return qs.filter(user=self.request.user)
        return qs

    def get_object(self):
        qs = self.get_queryset()
        if self.request.user.is_authenticated:
            qs = qs.filter(user=self.request.user)
        filter_kwargs = {self.lookup_field: self.kwargs[self.lookup_url_kwarg]}
        return get_object_or_404(qs, **filter_kwargs)


class ListCartView(CartMixin, generics.RetrieveAPIView):
    """Return all items that were saved
    in the specific user's cart"""

    queryset = Cart.objects.all()
    serializer_class = serializers.CartSerializer
    permission_classes = [AllowAny]
    lookup_url_kwarg = 'unique_id'
    lookup_field = 'session_id'

    # def retrieve(self, request, *args, **kwargs):
    #     instance = self.get_object()

    #     return Response(instance.items)


class CreateCartView(generics.CreateAPIView):
    """Create a new cart for the user"""

    serializer_class = serializers.ValidateCreateCart
    permission_classes = [AllowAny]


class DeleteFromCart(generics.DestroyAPIView):
    """Delete a set of objects from the cart"""

    permission_classes = [AllowAny]
    serializer_class = serializers.CartSerializer
    queryset = Cart.objects.all()

    def destroy(self, request, *args, **kwargs):
        cart = self.get_object()


class AddToCartView(generics.CreateAPIView):
    """Add a product to the cart. This allows the customer
    to add products being anonymous or logged in. In the
    first case, it returns a `session_id` used to identify
    the user and the list of products that were added to the
    cart for the given session"""

    serializer_class = serializers.ValidateCreateCart
    permission_classes = [AllowAny]


class UpdateInCartView(CartMixin, generics.UpdateAPIView):
    """Update item in cart (quantity, size...)"""

    serializer_class = serializers.ValidateCreateCart
    permission_classes = [AllowAny]
    lookup_url_kwarg = 'unique_id'
    lookup_field = 'session_id'


class DeleteFromCart(generics.GenericAPIView):
    """Delete one or multiple products
    from the user cart"""

    serializer_class = DeleteFromCartSerializer
    queryset = Cart.objects.all()


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

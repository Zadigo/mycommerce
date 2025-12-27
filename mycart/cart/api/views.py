from cart import tasks
from cart.api import serializers
from cart.models import Cart
from cart.sessions import CartJWTGenerator
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import fields, generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


class CartMixin:
    queryset = Cart.objects.all()

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


class DeleteFromCart(CartMixin, generics.DestroyAPIView):
    """Delete a set of objects from the cart"""

    permission_classes = [AllowAny]
    serializer_class = serializers.DeleteFromCartSerializer
    lookup_url_kwarg = 'unique_id'
    lookup_field = 'session_id'

    def destroy(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        instance = self.get_object()
        self.perform_destroy(instance, serializer)

        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance, serializer):
        product_ids = serializer.validated_data['product_ids']
        updated_items = [
            item for item in instance.items
            if item['product']['id'] not in product_ids
        ]
        instance.items = updated_items
        instance.save()

        tasks.calculate_total.apply_async(
            args=[instance.id],
            countdown=5
        )
        return instance


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

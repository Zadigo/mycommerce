from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import AllowAny

from cart.api import serializers
from cart.models import Cart


class CartMixin:
    queryset = Cart.objects.all()

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.user.is_authenticated:
            return qs.filter(user=self.request.user)
        return qs

    def get_object(self):
        qs = self.get_queryset()
        filter_kwargs = {self.lookup_field: self.kwargs[self.lookup_url_kwarg]}
        return get_object_or_404(qs, **filter_kwargs)


class ListCartView(generics.ListAPIView):
    """Return all carts that belong to the user"""

    queryset = Cart.objects.all()
    serializer_class = serializers.CartSerializer
    permission_classes = [AllowAny]


class ListCartItemsView(CartMixin, generics.RetrieveAPIView):
    """Return all items that were saved
    in the specific user's cart"""

    serializer_class = serializers.CartSerializer
    permission_classes = [AllowAny]
    lookup_url_kwarg = 'unique_id'
    lookup_field = 'session_id'


class CreateCartView(generics.CreateAPIView):
    """Create a new cart for the user"""

    serializer_class = serializers.ValidateCreateCart
    permission_classes = [AllowAny]

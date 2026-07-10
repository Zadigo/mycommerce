from cart import tasks
from cart.api import serializers
from cart.models import Cart
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
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

    def perform_create(self, serializer: serializers.ValidateCreateCart):
        instance: Cart = serializer.save()
        tasks.calculate_total.apply_async(
            args=[instance.id],
            countdown=5
        )


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

        for item_id, size in product_ids:
            instance.items = [
                item for item in instance.items
                if not (item['product']['id'] == item_id and item.get('size') == size)
            ]

        instance.save()

        tasks.calculate_total.apply_async(
            args=[instance.id],
            countdown=5
        )
        return instance

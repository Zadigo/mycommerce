from cart.api import serializers
from cart.api.serializers import ValidateCart, build_cart_response
from cart.models import Cart
from django.db.models import F, Q
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound, status
from rest_framework.generics import (DestroyAPIView, ListAPIView,
                                     RetrieveAPIView)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from mystore.responses import simple_api_response


@extend_schema(operation_id='List All Carts')
class ListAllCarts(ListAPIView):
    """Returns all the carts in the current shop
    that were created by the users (authenticated
    and none authenticated ones)"""

    serializer_class = serializers.CartSerializer
    queryset = Cart.objects.all()
    permission_classes = [IsAuthenticated]


@extend_schema(operation_id='List Cart')
class ListCart(RetrieveAPIView):
    """Return all items that were saved
    in the specific user's cart"""

    serializer_class = serializers.CartSerializer
    queryset = Cart.objects.all()
    permission_classes = [AllowAny]


# TODO: Test this class
class DeleteFromCart(DestroyAPIView):
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
        return Response(serializer.data, code=status.HTTP_204_NO_CONTENT)

    def get_queryset(self):
        queryset = super().get_queryset()

        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        logic = Q(session_id__exact=serializer.validated_data['session_id'])
        if self.request.user.is_authenticated:
            logic = logic & Q(user=self.request.user)

        return queryset.filter(logic)


@api_view(['get'])
@permission_classes([AllowAny])
def carts(request, **kwargs):
    """Return all items from the user's cart"""
    queryset = Cart.objects.all()
    serializer = serializers.CartSerializer(
        instance=queryset,
        many=True
    )
    return Response(serializer.data)
    # validator = ValidateCart(data=request.data)
    # validator.is_valid(raise_exception=True)
    # queryset = validator.list_items()
    # return simple_api_response(build_cart_response(queryset, validator.validated_data['session_id']))


@api_view(['post'])
@permission_classes([AllowAny])
def add_to_cart(request, **kwargs):
    """Add a product to the cart. This allows the customer
    to add products being anonymous or logged in. In the
    first case, it returns a `session_id` used to identify
    the user and the list of products that were added to the
    cart for the given session"""
    validator = ValidateCart(request, data=request.data)
    validator.is_valid(raise_exception=True)
    session_id, queryset = validator.save()
    return Response(build_cart_response(queryset, session_id))


@api_view(['post'])
@permission_classes([AllowAny])
def authenticate_user_cart(request, **kwargs):
    """Allows us to authenticate the items in the
    user's cart once they are logged in. This gets
    triggered only in the case where the user
    has started adding items when he was not
    authenticated and then authenticates for
    the payment process"""
    session_id = request.data.get('session_id', None)
    if session_id is not None and request.user.is_authenticated:
        queryset = Cart.objects.filter(session_id=session_id)
        queryset.update(user=request.user, is_anonymous=~F('is_anonymous'))
    return Response({'status': True})


@api_view(['post'])
@permission_classes([AllowAny])
def update_in_cart(request, **kwargs):
    """Update item in cart (quantity, size...)"""
    return Response(data={})


@api_view(['post'])
@permission_classes([AllowAny])
def delete_from_cart(request, **kwargs):
    """Delete one or multiple products
    from the user cart"""
    serializer = ValidateCart(data=request.data)
    serializer.is_valid(raise_exception=True)
    queryset = serializer.delete(request)
    session_id = serializer.validated_data['session_id']
    return simple_api_response(build_cart_response(queryset, session_id))

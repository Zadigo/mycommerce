from api.views import responses
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from cart.serializers import CartSerializer, ValidateCart, build_cart_response


@api_view(['post'])
@permission_classes([AllowAny])
def cart_view(request, **kwargs):
    """Return all items from the user's cart"""
    validator = ValidateCart(data=request.data)
    validator.is_valid(raise_exception=True)
    queryset = validator.list_items()
    return Response(data=build_cart_response(queryset, validator.validated_data['session_id']))


@api_view(['post'])
@permission_classes([AllowAny])
def add_to_cart_view(request, **kwargs):
    """Add a product to the cart"""
    validator = ValidateCart(data=request.data)
    validator.is_valid(raise_exception=True)

    session_id, queryset = validator.save(request)
    return responses.success_response(data=build_cart_response(queryset, session_id))


@api_view(['post'])
@permission_classes([AllowAny])
def update_in_cart_view(request, **kwargs):
    """Update item in cart (quantity, size...)"""
    return Response(data={})


@api_view(['post'])
def delete_from_cart_view(request, pk, **kwargs):
    """Delete a product from the cart"""
    # serializer = ValidateCartSession(data=request.data)
    serializer = ValidateCart(data=request.data)
    serializer.is_valid(raise_exception=True)
    queryset = serializer.delete(pk)
    session_id = serializer.validated_data['session_id']
    return responses.success_response(data=build_cart_response(queryset, session_id))

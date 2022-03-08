from api.serializers.carts import CartSerializer
from cart.models import Cart
from cart.utils import SessionManager
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['get'])
@permission_classes([AllowAny])
def cart_view(request, **kwargs):
    """Return all items from the user's cart"""
    # session_manager = SessionManager(request)
    # queryset = Cart.objects.get_cart_products(session_manager)
    # serializer = CartSerializer(instance=queryset, many=True)
    # return session_manager.get_response(Response, params={'data': serializer.data})
    return Response(data=[])


@api_view(['post'])
@permission_classes([AllowAny])
def add_to_cart_view(request, **kwargs):
    """Add a product to the cart"""
    # validator = ValidateCart(data=request.data)
    # validator.is_valid(raise_exception=True)
    # cart, queryset = validator.save(request)
        
    # serializer = CartSerializer(instance=queryset, many=True)
    # return Response(data=serializer.data)
    return Response(data={})


@api_view(['post', 'patch'])
@permission_classes([AllowAny])
def update_in_cart_view(request, **kwargs):
    """Update item in cart (quantity, size...)"""
    return Response(data={})


@api_view(['post'])
def delete_from_cart_view(request, **kwargs):
    """Delete a product from the cart"""
    return Response(data={})

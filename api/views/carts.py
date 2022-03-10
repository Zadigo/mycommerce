from django.shortcuts import get_object_or_404
from api.serializers.carts import CartSerializer, ValidateCart, ValidateCartSession
from cart.models import Cart
from cart.utils import SessionManager
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db.models import Sum
from api.views import responses


@api_view(['post'])
@permission_classes([AllowAny])
def cart_view(request, **kwargs):
    """Return all items from the user's cart"""
    serializer = ValidateCartSession(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    queryset = serializer.save()
    serializer = CartSerializer(instance=queryset, many=True)
    
    total = queryset.aggregate(total=Sum('total'))
    response_data = {
        'total': total['total'],
        'results': serializer.data
    }
    return responses.success_response(data=response_data)


@api_view(['post'])
@permission_classes([AllowAny])
def add_to_cart_view(request, **kwargs):
    """Add a product to the cart"""
    validator = ValidateCart(data=request.data)
    validator.is_valid(raise_exception=True)
    
    session_id, queryset = validator.save(request)
    
    serializer = CartSerializer(instance=queryset, many=True)
    response_data = {
        'session_id': session_id,
        'results': serializer.data,
        'total': None
    }
    return Response(data=response_data)


@api_view(['post', 'patch'])
@permission_classes([AllowAny])
def update_in_cart_view(request, **kwargs):
    """Update item in cart (quantity, size...)"""
    return Response(data={})


@api_view(['post'])
def delete_from_cart_view(request, pk, **kwargs):
    """Delete a product from the cart"""
    serializer = ValidateCartSession(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.delete(pk)
    return responses.success_response()

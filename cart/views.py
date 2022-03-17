from api.views import responses
from django.db.models import Count, Sum
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from cart.serializers import CartSerializer, ValidateCart, ValidateCartSession


def cart_statistics(queryset):
    values = queryset.values('product__name')
    grouped = values.annotate(count=Count('product__name'), total=Sum('price'))
    return grouped.order_by()


def build_cart_response(queryset, session_id):
    serializer = CartSerializer(instance=queryset, many=True)
    response_data = {
        'session_id': session_id,
        'results': serializer.data,
        'statistics': cart_statistics(queryset)
    }
    response_data = response_data | queryset.aggregate(total=Sum('price'))
    return response_data


@api_view(['post'])
@permission_classes([AllowAny])
def cart_view(request, **kwargs):
    """Return all items from the user's cart"""
    serializer = ValidateCartSession(data=request.data)
    serializer.is_valid(raise_exception=True)

    queryset = serializer.save()
    serializer = CartSerializer(instance=queryset, many=True)
    return responses.success_response(data=build_cart_response(queryset, serializer.validated_data['session_id']))


@api_view(['post'])
@permission_classes([AllowAny])
def add_to_cart_view(request, **kwargs):
    """Add a product to the cart"""
    validator = ValidateCart(data=request.data)
    validator.is_valid(raise_exception=True)

    session_id, queryset = validator.save(request)
    return responses.success_response(data=build_cart_response(queryset, session_id))


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
    queryset = serializer.delete(pk)
    session_id = serializer.validated_data['session_id']
    return responses.success_response(data=build_cart_response(queryset, session_id))

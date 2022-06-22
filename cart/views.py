from api.views import responses
from mycommerce.responses import simple_api_response
from orders.models import CustomerOrder, ProductHistory
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from cart.models import Cart
from cart.serializers import (ValidateCart, ValidateShipment,
                              build_cart_response)


@api_view(['post'])
@permission_classes([AllowAny])
def cart_view(request, **kwargs):
    """Return all items from the user's cart"""
    validator = ValidateCart(data=request.data)
    validator.is_valid(raise_exception=True)
    queryset = validator.list_items()
    return simple_api_response(build_cart_response(queryset, validator.validated_data['session_id']))


@api_view(['post'])
@permission_classes([AllowAny])
def add_to_cart_view(request, **kwargs):
    """Add a product to the cart"""
    validator = ValidateCart(data=request.data)
    validator.is_valid(raise_exception=True)

    session_id, queryset = validator.save(request)
    return simple_api_response(build_cart_response(queryset, session_id))


@api_view(['post'])
@permission_classes([AllowAny])
def update_in_cart_view(request, **kwargs):
    """Update item in cart (quantity, size...)"""
    return Response(data={})


@api_view(['post'])
def delete_from_cart_view(request, **kwargs):
    """Delete a product from the cart"""
    serializer = ValidateCart(data=request.data)
    serializer.is_valid(raise_exception=True)
    queryset = serializer.delete(request)
    session_id = serializer.validated_data['session_id']
    return simple_api_response(build_cart_response(queryset, session_id))


@api_view(['post'])
@permission_classes([AllowAny])
def payment_view(request, **kwargs):
    shipment_serializer = ValidateShipment(data=request.data)
    shipment_serializer.is_valid(raise_exception=True)
    
    # 1. Get the customer's cart
    queryset = Cart.objects.cart_items(request.data.get('session_id', None))
    
    if queryset.exists():
        # 1. Execute payment with Stripe
        
        # 2. Create an order
        attrs = {
            'stripe_reference': 'some reference',
            'user': request.user if request.user.is_authenticated else None,
            'address': shipment_serializer.validated_data['address'],
            'city': shipment_serializer.validated_data['city'],
            'zip_code': shipment_serializer.validated_data['zip_code']
        }
        customer_order = CustomerOrder.objects.create(**attrs)

        items_to_create = []
        for item in queryset:
            items_to_create.append(ProductHistory(product=item.product, unit_price=item.price))
            
        created_items = ProductHistory.objects.bulk_create(items_to_create)
        customer_order.products.add(*created_items)
        return simple_api_response({'state': True, 'reference': customer_order.reference})
    return simple_api_response({'state': False})


@api_view(['post'])
@permission_classes([AllowAny])
def success_view(request, **kwargs):
    pass

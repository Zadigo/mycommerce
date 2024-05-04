from django.db.models import DecimalField, F, Value
from django.shortcuts import get_object_or_404
from django.utils.crypto import get_random_string
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from cart.api import serializers
from cart.api.serializers import (ValidateCart, ValidateShipment,
                                  build_cart_response)
from cart.models import Cart
from cart.payment import payment_interface
from mycommerce.responses import simple_api_response
from orders.models import CustomerOrder, ProductHistory


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


@api_view(['get'])
@permission_classes([AllowAny])
def cart(request, pk, **kwargs):
    """Return all items from the user's cart"""
    cart = get_object_or_404(Cart, id=pk)
    serializer = serializers.CartSerializer(instance=cart)
    return Response(serializer.data)


@api_view(['post'])
@permission_classes([AllowAny])
def add_to_cart(request, **kwargs):
    """Add a product to the cart. Returns
    a `session_id` and the list of products
    that were for the given session"""
    validator = ValidateCart(data=request.data)
    validator.is_valid(raise_exception=True)

    session_id, queryset = validator.save(request)
    return simple_api_response(build_cart_response(queryset, session_id))


@api_view(['post'])
@permission_classes([AllowAny])
def authenticate_user_cart(request, **kwargs):
    """Allows us to authenticate the items in the
    user's cart once they logged in. This gets
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
    """Delete a product from the cart"""
    serializer = ValidateCart(data=request.data)
    serializer.is_valid(raise_exception=True)
    queryset = serializer.delete(request)

    if request.user.is_authenticated:
        return Response({'status': False})
    else:
        session_id = serializer.validated_data['session_id']
        return simple_api_response(build_cart_response(queryset, session_id))


@api_view(['post'])
@permission_classes([IsAuthenticated])
def payment(request, **kwargs):
    """Here the user pays for the elements that
    are currently in his cart. An order is created
    in the database and a set of automations are
    eventually sent via N8N to the linked backends"""
    shipment_serializer = ValidateShipment(data=request.data)
    shipment_serializer.is_valid(raise_exception=True)

    # 1. Get the customer's cart
    session_id = shipment_serializer.validated_data['session_id']
    queryset = Cart.objects.cart_items(session_id)

    if queryset.exists():
        # 1. Execute payment with Stripe
        payment_interface.payment(14)
        if not payment_interface.completed:
            return payment_interface.get_fail_response()

        # 2. Create an order
        attrs = {
            'reference': get_random_string(12),
            'stripe_reference': f'cus_{get_random_string(length=30)}',
            'user': request.user if request.user.is_authenticated else None,
            'address': shipment_serializer.validated_data['address'],
            'city': shipment_serializer.validated_data['city'],
            'zip_code': shipment_serializer.validated_data['zip_code']
        }
        customer_order = CustomerOrder.objects.create(**attrs)

        total = Cart.objects.cart_total(request, session_id=session_id)
        customer_order.total = total['price__sum']
        customer_order.save()

        queryset.update(is_paid_for=~F('is_paid_for'))

        items_to_create = []
        for item in queryset:
            items_to_create.append(ProductHistory(
                product=item.product,
                unit_price=item.price
            ))

        created_items = ProductHistory.objects.bulk_create(items_to_create)
        customer_order.products.add(*created_items)
        return Response({'state': True, 'reference': customer_order.reference, 'total': total})
    return Response({'message': 'Empty cart'}, status=402)

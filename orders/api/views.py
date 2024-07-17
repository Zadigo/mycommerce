from django.core.cache import cache
from django.db.models import F, Sum
from django.utils.crypto import get_random_string
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from cart.models import Cart
from mycommerce.choices import ShipmentChoices
from orders.api.serializers import (CustomerOrderSerializer,
                                    DeliveryOptionsSerializer,
                                    ValidateShipment)
from orders.models import CustomerOrder, ProductHistory
from orders.payment import payment_interface


class ListCustomerOrders(ListAPIView):
    """Returns the list of all the customer orders
    that were performed by the user
    """

    serializer_class = CustomerOrderSerializer
    queryset = CustomerOrder.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class ListDeliveryOptions(ListAPIView):
    serializer_class = DeliveryOptionsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if cache.has_key('delivery_options'):
            return cache.get('delivery_options')

        def map_options():
            for i, choice in enumerate(ShipmentChoices.choices):
                yield {'id': i + 1, 'name': choice[0]}

        delivery_options = list(map_options())
        cache.set('delivery_options', delivery_options, timeout=3600)
        return delivery_options


@api_view(['post'])
@permission_classes([IsAuthenticated])
def new_customer_order(request, **kwargs):
    """Here the user pays for the elements that
    are currently in his cart. An order is created
    in the database and a set of automations are
    eventually sent via N8N to the linked backends"""
    shipment_serializer = ValidateShipment(data=request.data)
    shipment_serializer.is_valid(raise_exception=True)

    # 1. Get the customer's cart in order to check that
    # the and order can actually be created/passed
    session_id = shipment_serializer.validated_data['session_id']
    queryset = Cart.objects.cart_items(session_id)

    if queryset.exists():
        # 2. Check that the user has an active
        # billing address on their account, if
        # not, user the data from the shipment
        # serializer to create a new billing
        # address account
        billing_addresses = request.user.userprofile.address_set.all()
        params = {
            'firstname': shipment_serializer.validated_data['firstname'],
            'lastname': shipment_serializer.validated_data['lastname'],
            'address_line': shipment_serializer.validated_data['address_line'],
            'zip_code': shipment_serializer.validated_data['zip_code'],
            'country': shipment_serializer.validated_data['country'],
            'city': shipment_serializer.validated_data['city'],
            'telephone': shipment_serializer.validated_data['telephone'],
            'user_profile': request.user.userprofile
        }
        billing_address, state = billing_addresses.update_or_create(
            defaults=params,
            firstname=params['firstname'],
            lastname=params['lastname'],
            address_line=params['address_line']
        )

        # 3. Recalculate the total that the
        # customer has to pay for the items
        # in the cart --; taking into account
        # unit_price, discounted prices and
        # sale price
        total_to_pay = queryset.aggregate(total=Sum('price'))

        # 2. Execute the payment with Stripe
        payment_interface.payment(
            request,
            total_to_pay['total'],
            debug=True,
            **params
        )
        if not payment_interface.completed:
            return payment_interface.get_fail_response()

        # 4. This is the section that creates the
        # order in the datbase
        attrs = {
            'reference': get_random_string(12),
            'stripe_charge': f'ch_{get_random_string(length=30)}',
            'user': request.user,
            'address': billing_address.address_line,
            'city': billing_address.city,
            'zip_code': billing_address.zip_code
        }
        customer_order = CustomerOrder.objects.create(**attrs)
        customer_order.total = total_to_pay['total']
        customer_order.save()
        # total = Cart.objects.cart_total(request, session_id=session_id)
        # customer_order.total = total['price__sum']
        # customer_order.save()

        queryset.update(is_paid_for=~F('is_paid_for'))

        # 5. Save the products at the price state at
        # which the customer bought them
        items_to_create = []
        for item in queryset:
            product_history = ProductHistory(
                product=item.product,
                unit_price=item.price
            )
            items_to_create.append(product_history)

        created_items = ProductHistory.objects.bulk_create(items_to_create)
        customer_order.products.add(*created_items)

        # 6. Create a new shipment object that will be
        # completed once we get a tracking number for
        # the user by the shipping provivider
        shipment = customer_order.shipment_set.create(
            customer_order=customer_order,
            transporter=shipment_serializer.validated_data['delivery_option']
        )

        # 6. Send webhooks as required using N8N or
        # other automated interfaces
        # webhooks = Webhook(request, '/my-path')
        # webhooks.send()

        return Response({'state': True, 'reference': customer_order.reference, 'total': total_to_pay['total']})
    return Response({'message': 'Empty cart'}, status=status.HTTP_402_PAYMENT_REQUIRED)

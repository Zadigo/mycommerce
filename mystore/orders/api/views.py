from orders import tasks
from cart.models import Cart
from django.core.cache import cache
from django.db.models import F, Sum
from django.utils.crypto import get_random_string
from orders.api import serializers
from orders.models import CustomerOrder, ProductHistory
from orders.payment import PaymentInterface
from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from mystore.choices import ShipmentChoices


class ListCustomerOrders(ListAPIView):
    """Returns the list of all the customer orders
    that were performed by the user
    """

    serializer_class = serializers.CustomerOrderSerializer
    queryset = CustomerOrder.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(user=self.request.user)


class ListDeliveryOptions(ListAPIView):
    serializer_class = serializers.DeliveryOptionsSerializer
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


class CartMixin:
    """This mixin provides the subclasses with functions that
    can provide basic information on the items in a customer's
    cart .e.g. the items in the cart, the cart's total etc."""

    def get_cart_queryset(self, request, serializer):
        session_id = serializer.validated_data['session_id']
        return Cart.objects.cart_items(session_id)

    def get_cart_amount(self, request, serializer):
        queryset = self.get_cart_queryset(request, serializer)
        return queryset.aggregate(total=Sum('price'))['total']

    def cart_empty_response(self):
        return Response({'message': 'Empty cart'}, status=status.HTTP_402_PAYMENT_REQUIRED)


class CreatePaymentIntent(CartMixin, CreateAPIView):
    """This view is used to indicate that the user
    intends to pay for the products that were
    added to his cart. This endpoint is triggered
    on cart/shipment or cart/home"""

    serializer_class = serializers.ValidateCreateIntent
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        queryset = self.get_cart_queryset(request, serializer)
        if not queryset.exists():
            return self.cart_empty_response()

        interface = PaymentInterface()
        amount = self.get_cart_amount(request, serializer)
        state = interface.payment_intent(request, amount)
        if not state:
            return interface.get_fail_response()

        headers = self.get_success_headers(interface.response_data)
        return interface.get_success_response(headers=headers, message='Intent created')


class UpdatePaymentIntent(CartMixin, CreateAPIView):
    """This endpoint is used to update the pieces of
    information on a given payment intent. This endpoint
    is triggered on the page cart/shipment in Nuxt"""

    serializer_class = serializers.ValidateShipment
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        return serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        queryset = self.get_cart_queryset(request, serializer)
        if not queryset.exists():
            return self.cart_empty_response()

        billing_address = self.perform_create(serializer)

        interface = PaymentInterface()
        amount = self.get_cart_amount(request, serializer)
        state = interface.update_intent(
            serializer.validated_data['intent'],
            billing_address
        )
        if not state:
            return interface.get_fail_response()

        headers = self.get_success_headers(interface.response_data)
        return interface.get_success_response(headers=headers, message='Intent updated')


class CapturePaymentIntent(CartMixin, CreateAPIView):
    """This final endpoint from the cart payment process
    is the one that indicates to Stripe that the payment
    should be captured with the provided information. This
    endpoint is triggered on the cart/payment page"""

    serializer_class = serializers.ValidateOrder
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        queryset = self.get_cart_queryset(request, serializer)
        if queryset.exists():
            interface = PaymentInterface()

            logic = [
                not self.request.user.userprofile.has_payment_method,
                self.request.user.userprofile.source_id != serializer.validated_data['card']
            ]

            if any(logic):
                source = interface.create_new_source(
                    self.request.user.userprofile.stripe_id,
                    serializer.validated_data['token']
                )

                if not source:
                    return interface.get_fail_response()

                request.user.userprofile.source_id = source['id']
                request.user.userprofile.save()

            state_or_response = interface.capture_intent(
                request,
                serializer.validated_data['intent'],
                request.user.userprofile.source_id
                # serializer.validated_data['card']
            )
            if not state_or_response:
                return interface.get_fail_response()

            billing_address = self.request.user.userprofile.address_set.get(
                is_active=True
            )

            attrs = {
                'reference': get_random_string(12),
                'stripe_charge': state_or_response['latest_charge'],
                'user': request.user,
                'address': billing_address.address_line,
                'city': billing_address.city,
                'zip_code': billing_address.zip_code
            }
            customer_order = CustomerOrder.objects.create(**attrs)
            customer_order.total = self.get_cart_amount(request, serializer)
            customer_order.save()

            # 5. Save the products at the price state at
            # which the customer bought them. This allows
            # us and the customer to keep track of the previous
            # prices of the given product
            items_to_create = []
            for item in queryset:
                product_history = ProductHistory(
                    product=item.product,
                    unit_price=item.price
                )
                items_to_create.append(product_history)

            created_items = ProductHistory.objects.bulk_create(items_to_create)
            customer_order.products.add(*created_items)

            queryset.update(is_paid_for=~F('is_paid_for'))

            # 6. Create a new shipment object that will be
            # completed once we get a tracking number for
            # the user by the shipping provider
            shipment = customer_order.shipment_set.create(
                customer_order=customer_order,
                transporter=serializer.validated_data['delivery_option']
            )

            # 6. Send webhooks as required using N8N or
            # other automated interfaces
            # webhooks = Webhook(request, '/my-path')
            # webhooks.send()
            return interface.get_success_response(customer_order=customer_order.reference)

        return self.cart_empty_response()


class CancelOrder(UpdateAPIView):
    queryset = CustomerOrder.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.CancelOrderSerializer
    lookup_field = 'reference'
    lookup_url_kwarg = 'reference'

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(user__id=self.request.user, refund_requested=True)

    def update(self, request, *args, **kwargs):
        instance = super().get_object()
        tasks.refund_request.apply_async((instance.reference,), countdown=60)
        return super().update(request, *args, **kwargs)

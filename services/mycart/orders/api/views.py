from typing import Type

from cart.models import Cart
from django.db.models import F
from django.shortcuts import get_object_or_404
from django.utils.crypto import get_random_string
from orders import tasks
from orders.api import serializers
from orders.models import CustomerOrder
from orders.payment import PaymentInterface
from rest_framework import status
from rest_framework.generics import (CreateAPIView, GenericAPIView,
                                     ListAPIView, UpdateAPIView)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from orders.payment.routers import GolangPaymentRouter


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


class CartMixin:
    """This mixin provides the subclasses with functions that
    can provide basic information on the items in a customer's
    cart .e.g. the items in the cart, the cart's total etc."""

    error_message = {'message': 'Empty cart'}

    def get_cart_object(self, request, serializer):
        session_id = serializer.validated_data['session_id']
        return get_object_or_404(Cart, session_id=session_id)

    def cart_empty_response(self):
        return Response(self.error_message, status=status.HTTP_400_BAD_REQUEST)


class CreatePaymentIntent(CartMixin, CreateAPIView):
    """This view is used to indicate that the user
    intends to pay for the products that were
    added to a cart. This endpoint is triggered
    on cart/shipment or cart/home"""

    serializer_class = serializers.ValidateCreateIntent
    permission_classes = [AllowAny]
    error_messages = {
        'stale': 'Invalid operation on stale cart',
        'paid': 'Invalid operation on paid cart',
        'mismatch': 'Total amount mismatch'
    }

    def create_error(self, key: str):
        return Response({'message': self.error_messages[key]}, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        incoming_total = serializer.validated_data['total']
        cart = self.get_cart_object(request, serializer)

        # We want to avoid creating multiple intents
        # so that we can track the customer correctly
        if cart.payment_intent is not None:
            return Response({'intent': cart.payment_intent}, status=status.HTTP_200_OK)

        if cart.total > 0:
            if cart.total != incoming_total:
                return self.create_error('mismatch')

        if cart.is_paid_for:
            return self.create_error('paid')

        if cart.is_stale:
            return self.create_error('stale')

        intent = PaymentInterface()
        state = intent.payment_intent(request, cart.total)

        if not state:
            return intent.get_fail_response()

        cart.payment_intent = state.id
        cart.save()

        headers = self.get_success_headers(intent.response_data)
        return intent.get_success_response(headers=headers, message='Intent created')


class UpdatePaymentIntent(CartMixin, GenericAPIView):
    """This endpoint is used to update the pieces of
    information on a given payment intent. This endpoint
    is triggered on the page cart/shipment in Nuxt"""

    serializer_class = serializers.ValidateUpdateIntent
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        return serializer.save()

    def update_billing_address(self, interface: PaymentInterface, cart: Cart, validated_data: dict):
        shipment_data = validated_data.get('shipment', None)
        if shipment_data is not None:
            billing_addresses = self.request.user.userprofile.address_set.all()
            params = {
                'firstname': shipment_data['firstname'],
                'lastname': shipment_data['lastname'],
                'address_line': shipment_data['address_line'],
                'zip_code': shipment_data['zip_code'],
                'country': shipment_data['country'],
                'city': shipment_data['city'],
                'telephone': shipment_data['telephone'],
                'user_profile': self.request.user.userprofile
            }
            billing_address, state = billing_addresses.update_or_create(
                defaults=params,
                firstname=params['firstname'],
                lastname=params['lastname'],
                address_line=params['address_line']
            )

            active_addresses = billing_addresses.filter(is_active=True)
            if not active_addresses.exists():
                billing_addresses.update(is_active=False)
                billing_address.is_active = True
                billing_address.save()

            return interface.update_intent(
                cart.payment_intent,
                billing_address=billing_address
            )

    def update_total(self, interface: PaymentInterface, cart: Cart, total: float):
        return interface.update_intent(cart.payment_intent, total=total)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = self.get_cart_object(request, serializer)
        if not cart.payment_intent:
            return Response({'message': 'No payment intent associated with this cart'}, status=status.HTTP_400_BAD_REQUEST)

        interface = PaymentInterface()

        if cart.is_anonymous:
            if self.request.user.is_authenticated:
                cart.user = self.request.user

                # In order to check out, the user must login. Link
                # the intent with the stripe customer id
                state = interface.update_intent(
                    cart.payment_intent,
                    customer=self.request.user.userprofile.stripe_id
                )
                if not state:
                    return interface.get_fail_response()

                cart.is_anonymous = ~F('is_anonymous')
                cart.save()

        shipment = serializer.validated_data.get('shipment', None)
        total = serializer.validated_data.get('total', None)

        if shipment is None and total is None:
            return Response({'message': 'No data provided to update'}, status=status.HTTP_200_OK)

        if shipment is not None:
            state = self.update_billing_address(
                interface, cart, serializer.validated_data)

            if not state:
                return interface.get_fail_response()

        if total is not None:
            state = self.update_total(interface, cart, total)
            if not state:
                return interface.get_fail_response()

        return interface.get_success_response(message='Intent updated')


class CapturePaymentIntent(CartMixin, CreateAPIView):
    """This final endpoint from the cart payment process
    is the one that indicates to Stripe that the payment
    should be captured with the provided information. This
    endpoint is triggered on the cart/payment page"""

    serializer_class = serializers.ValidateOrder
    permission_classes = [IsAuthenticated]

    def create(self, request: Request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = self.get_cart_object(request, serializer)

        if cart.total <= 0:
            return self.cart_empty_response()

        is_valid = all([
            not cart.is_paid_for,
            not cart.is_stale,
            # cart.total == serializer.validated_data['total']
        ])

        if is_valid:
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
            customer_order.total = cart.total
            customer_order.save()

            # 5. Save the products at the price state at
            # which the customer bought them. This allows
            # us and the customer to keep track of the previous
            # prices of the given product
            tasks.workflow_order_create_products.apply_async(
                args=[cart.id],
                countdown=30
            )
            # items_to_create = []
            # for item in queryset:
            #     product_history = Product(
            #         product=item.product,
            #         unit_price=item.price
            #     )
            #     items_to_create.append(product_history)

            # created_items = Product.objects.bulk_create(items_to_create)
            # customer_order.products.add(*created_items)

            cart.is_paid_for = ~F('is_paid_for')

            # 6. Create a new shipment object that will be
            # completed once we get a tracking number for
            # the user by the shipping provider
            shipment = customer_order.shipment_set.create(
                customer_order=customer_order,
                transporter=serializer.validated_data['delivery_option']
            )

            # 6. Send webhooks as required using N8N or
            # other automated interfaces
            tasks.workflow_trigger_order_webhooks.apply_async(
                args=[
                    customer_order.reference,
                    cart.id
                ],
                countdown=60
            )
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


class GolangRouter(GenericAPIView):
    """This endpoint is used to route the payment information
    from the Golang service to the Django backend. This is
    required because we want to keep all the payment logic
    in the Django backend and avoid having to duplicate it in
    the Golang service"""

    permission_classes = [IsAuthenticated]
    router_class: Type[GolangPaymentRouter] = GolangPaymentRouter

    def get_router(self):
        return self.router_class(self.request)
    
    def get(self, request: Request, *args, **kwargs):
        pass

    def post(self, request: Request, *args, **kwargs):
        router = self.get_router()
        return router.get_payment_intent(request.data)

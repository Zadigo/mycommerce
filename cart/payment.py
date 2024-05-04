import os

import stripe
from django.conf import settings
from rest_framework.response import Response
from django.utils.http import urlsafe_base64_encode


class PaymentInterface:
    def __init__(self):
        self.completed = False
        self.response_data = {}

        if settings.DEBUG:
            stripe.api_key = os.getenv('STRIPE_DEVELOPMENT_API_KEY')
        else:
            stripe.api_key = os.getenv('STRIPE_PRODUCTION_API_KEY')

    def get_fail_response(self, **kwargs):
        data = {'message': 'Payment failed'} | kwargs
        return Response(data, status=402)

    def get_success_response(self, **kwargs):
        return Response({'message': 'Payment completed', **kwargs})

    def update_carrier(self, charge, customer, carrier, tracking_number):
        stripe.PaymentIntent.modify(
            charge,
            customer=customer,
            shipping_details={
                'carrier': carrier,
                'tracking_number': tracking_number,
            }
        )

    def payment(self, request, amount, **kwargs):
        if not request.user.is_authenticated:
            return False

        response = stripe.PaymentIntent.create(
            amount=amount,
            currency='eur',
            confirm=True,
            customer=request.user.user_profile.stripe_id,
            description=None,
            metadata={},
            billing_details={
                'address': {
                    'line1': None,
                    'line2': None,
                    'postal_code': None,
                    'city': None,
                    'state': None,
                    'country': None,
                },
                'name': request.user.get_fullname(),
                'phone': None,
                'email': request.user.email
            },
            receipt_email=request.user.email,
            **kwargs
        )
        token = urlsafe_base64_encode(bytes(response['client_secret']))
        return self.get_success_response(token=token)


    def refund(self, request, charge):
        resposne = stripe.Refund.create(
            charge=charge,
            reason=None,
            metadata={}
        )


payment_interface = PaymentInterface()

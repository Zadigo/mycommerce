import os

import stripe
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.response import Response


class PaymentInterface:
    def __init__(self):
        self.completed = False
        self.response_data = {}
        self.errors = {}

        if settings.DEBUG:
            stripe.api_key = os.getenv('STRIPE_DEVELOPMENT_API_KEY')
        else:
            stripe.api_key = os.getenv('STRIPE_PRODUCTION_API_KEY')

    def get_fail_response(self, **kwargs):
        data = {'message': 'Payment failed'} | kwargs | self.errors
        return Response(data, status=status.HTTP_402_PAYMENT_REQUIRED)

    def get_success_response(self, **kwargs):
        data = {'message': 'Payment completed'} | kwargs
        return Response(data)

    def update_carrier(self, charge, customer, carrier, tracking_number):
        stripe.PaymentIntent.modify(
            charge,
            customer=customer,
            shipping_details={
                'carrier': carrier,
                'tracking_number': tracking_number,
            }
        )

    def payment(self, request, amount, debug=False, **kwargs):
        if not request.user.is_authenticated:
            return False

        if debug:
            self.completed = True
            token = urlsafe_base64_encode(bytes('1234'.encode('utf-8')))
            return self.get_success_response(token=token)

        params = {
            'amount': float(amount),
            'currency': 'eur',
            'confirm': True,
            'customer': request.user.userprofile.stripe_id,
            'description': None,
            'metadata': {},
            'billing_details': {
                'address': {
                    'line1': None,
                    'line2': None,
                    'postal_code': None,
                    'city': None,
                    'state': None,
                    'country': None,
                },
                'name': request.user.get_full_name(),
                'phone': None,
                'email': None
            },
            'receipt_email': None,
        }

        try:
            response = stripe.PaymentIntent.create(**params)
        except stripe.StripeError as e:
            self.errors['payment_error'] = e.args
        except Exception as e:
            self.errors['payment_error'] = e.args
        finally:
            if self.errors:
                return False

        token = urlsafe_base64_encode(bytes(response['client_secret']))
        return self.get_success_response(token=token)

    def refund(self, request, charge, reason=None):
        response = stripe.Refund.create(
            charge=charge,
            reason=None,
            metadata={}
        )


payment_interface = PaymentInterface()

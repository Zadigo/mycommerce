import dataclasses
import os

import stripe
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.response import Response


@dataclasses.dataclass
class PaymentDetails:
    payment_intent_id: str = None
    client_secret: str = None


class StripeInterfaceMixin:
    def __init__(self):
        self.completed = False
        self.response_data = {}
        self.errors = {}

        if settings.DEBUG:
            stripe.api_key = os.getenv('STRIPE_TEST_SECRET_KEY')
        else:
            stripe.api_key = os.getenv('STRIPE_PRODUCTION_API_KEY')

    @staticmethod
    def adapt_number(value):
        return int(float(value)) * 100


class PaymentInterface(StripeInterfaceMixin):
    def __init__(self):
        self.payment_details = PaymentDetails()
        super().__init__()

    def get_fail_response(self, **kwargs):
        data = {'message': 'Payment failed'} | kwargs | self.errors
        return Response(data, status=status.HTTP_402_PAYMENT_REQUIRED)

    def get_success_response(self, **kwargs):
        data = {
            'message': 'Payment completed',
            'client': self.payment_details.client_secret
        }
        return Response(data | kwargs)

    def update_carrier(self, charge, customer, carrier, tracking_number):
        try:
            response = stripe.PaymentIntent.modify(
                charge,
                customer=customer,
                shipping={
                    'carrier': carrier,
                    'tracking_number': tracking_number,
                }
            )
        except stripe.StripeError as e:
            self.errors['update_error'] = e.args
        except Exception as e:
            self.errors['update_error'] = e.args
        else:
            return True
        finally:
            if self.errors:
                return False

    def payment(self, request, amount, debug=False, products=[], billing_address=None, stripe_params={}):
        if not request.user.is_authenticated:
            return False

        if debug:
            self.completed = True
            token = urlsafe_base64_encode(bytes('1234'.encode('utf-8')))
            return self.get_success_response(token=token)

        address_line1 = stripe_params.get('address_line')
        zip_code = stripe_params.get('zip_code')
        city = stripe_params.get('city')
        country = stripe_params.get('country')
        telephone = stripe_params.get('telephone')
        source = stripe_params.get('source')
        card_token = stripe_params.get('card_token')

        params = {
            'amount': self.adapt_number(amount),
            'source': source,
            'setup_future_usage': 'off_session',
            'payment_method_types': ['card'],
            'automatic_payment_methods': {
                'enabled': False
            },
            'currency': 'eur',
            'customer': request.user.userprofile.stripe_id,
            'description': 'Customer order for products',
            'metadata': {},
            'shipping': {
                'address': {
                    'line1': address_line1,
                    'line2': None,
                    'postal_code': zip_code,
                    'city': city,
                    'state': None,
                    'country': country,
                },
                'name': request.user.get_full_name(),
                'phone': telephone,
                'carrier': None
            },
            'receipt_email': request.user.email,
        }

        try:
            response = stripe.PaymentIntent.create(**params)
        except stripe.StripeError as e:
            print(e)
            self.errors['payment_error'] = e.args
        except Exception as e:
            self.errors['payment_error'] = e.args
        finally:
            if self.errors:
                return False

        intent_id = response['id']
        client_secret = response['client_secret'].encode('utf-8')
        token = urlsafe_base64_encode(bytes(client_secret))

        self.payment_details.client_secret = token
        self.payment_details.payment_intent_id = intent_id
        self.completed = True
        return True

    def refund(self, request, charge, reason=None):
        try:
            response = stripe.Refund.create(
                charge=charge,
                reason=None,
                metadata={}
            )
        except stripe.StripeError as e:
            self.errors['update_error'] = e.args
        except Exception as e:
            self.errors['update_error'] = e.args
        else:
            return True
        finally:
            if self.errors:
                return False

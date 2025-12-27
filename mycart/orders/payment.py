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

# TODO: Remove


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

    def get_fail_response(self, message=None, **kwargs):
        data = {'message': 'Payment failed'} | kwargs | self.errors
        return Response(data, status=status.HTTP_402_PAYMENT_REQUIRED)

    def get_success_response(self, message=None, **kwargs):
        data = {
            'intent': self.payment_details.payment_intent_id,
            'client': self.payment_details.client_secret
        }
        if message is not None:
            data['message'] = message
        self.response_data = data | kwargs
        return Response(self.response_data, status=status.HTTP_201_CREATED)

    def create_new_source(self, customer: str, source: str):
        if settings.DEBUG:
            source = 'tok_visa'

        if customer is None or source is None:
            self.errors['payment_error'] = 'Customer or source is None'
            return False

        try:
            response = stripe.Customer.create_source(
                customer,
                source=source
            )
        except stripe.StripeError as e:
            self.errors['payment_error'] = e.args
        except Exception as e:
            self.errors['payment_error'] = e.args
        finally:
            if self.errors:
                return False
        return response

    def update_intent(self, intent_id: str, billing_address=None, total: int = None, carrier: dict = None, customer: str = None):
        """Update a previously created intent with additonal
        information from the shipment page"""
        params = {}

        if billing_address is not None:
            params['shipping'] = {
                'address': {
                    'line1': getattr(billing_address, 'address_line'),
                    'line2': None,
                    'postal_code': getattr(billing_address, 'zip_code'),
                    'city': getattr(billing_address, 'city'),
                    'state': None,
                    'country': getattr(billing_address, 'country'),
                },
                'name': billing_address.get_full_name,
                'phone': getattr(billing_address, 'telephone')
            }

        if total is not None:
            params['amount'] = self.adapt_number(total)

        if carrier is not None:
            params['shipping'] = {
                'carrier': carrier,
                'tracking_number': None
            }

        if customer is not None:
            params['customer'] = customer

        logic = all([
            billing_address is None,
            total is None,
            customer is None,
        ])

        if logic:
            # If no parameters to update, return makes
            # no sense to call stripe API
            return True

        try:
            response = stripe.PaymentIntent.modify(intent_id, **params)
        except stripe.StripeError as e:
            self.errors['payment_error'] = e.args
            return False
        except Exception as e:
            self.errors['payment_error'] = e.args
            return False
        else:
            if self.errors:
                return False
            
            return response

    def payment_intent(self, request, amount: int, billing_adress: str = None, debug: bool = False, products=[], stripe_params={}):
        """Create a new payment intent for the given amount

        Args:
            request: The current request object
            amount (int): The amount to be charged in euros
            billing_adress (str, optional): The billing address object. Defaults to None.
            debug (bool, optional): Whether to use debug mode. Defaults to False. Defaults to False.
            products (list, optional): List of products in the cart. Defaults to [].
            stripe_params (dict, optional): Additional stripe parameters. Defaults to {}.
        """
        session_id = stripe_params.get('session_id')

        params = {
            'amount': self.adapt_number(amount),
            'setup_future_usage': 'off_session',
            'payment_method_types': ['card'],
            'idempotency_key': session_id,
            'automatic_payment_methods': {
                'enabled': False
            },
            'currency': 'eur',
            'description': 'Customer order for products',
            'metadata': {}
        }

        if request.user.is_authenticated:
            params['customer'] = request.user.userprofile.stripe_id
            params['receipt_email'] = request.user.email,

        try:
            response = stripe.PaymentIntent.create(**params)
        except stripe.StripeError as e:
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

    def capture_intent(self, request, intent, payment_method):
        try:
            response = stripe.PaymentIntent.confirm(
                intent,
                payment_method=payment_method
            )
        except stripe.StripeError as e:
            self.errors['payment_error'] = e.args
        except Exception as e:
            self.errors['payment_error'] = e.args
        finally:
            if self.errors:
                return False

        self.completed = True
        return response

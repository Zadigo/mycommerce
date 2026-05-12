import dataclasses
import os
from typing import Any, Optional

import stripe
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.response import Response
from django.http.request import HttpRequest


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
    def adapt_number(value: int | float):
        return int(float(value)) * 100


class PaymentInterface(StripeInterfaceMixin):
    """The PaymentInterface class provides a high-level interface for handling payment 
    operations using Stripe internally. It includes methods for creating and updating 
    payment intents, as well as capturing payments. The class also provides methods for generating 
    success and failure responses based on the outcome of payment operations."""

    def __init__(self):
        self.payment_details = PaymentDetails()
        super().__init__()

    def get_fail_response(self, message: Optional[str] = None, **kwargs):
        data = {'message': 'Payment failed'} | kwargs | self.errors
        return Response(data, status=status.HTTP_402_PAYMENT_REQUIRED)

    def get_success_response(self, message: Optional[str] = None, **kwargs):
        data = {
            'intent': self.payment_details.payment_intent_id,
            'client': self.payment_details.client_secret
        }
        if message is not None:
            data['message'] = message
        self.response_data = data | kwargs
        return Response(self.response_data, status=status.HTTP_201_CREATED)

    def create_new_source(self, customer: str, source: str):
        """Create a new payment source for the given customer.

        Args:
            customer (str): The Stripe customer id.
            source (str): The payment source token (e.g., card token).
        """
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

        if self.errors:
            return False

        return response

    def update_intent(self, intent_id: str, billing_address=None, total: int = None, carrier: dict = None, customer: str = None):
        """Update a previously created intent with additonal
        information from the shipment page

        Args:
            intent_id (str): The id of the payment intent to update
            billing_address (BillingAddress, optional): The billing address of the customer. Defaults to None.
            total (int, optional): The total amount of the order. Defaults to None.
            carrier (dict, optional): The carrier information for the shipment. Defaults to None.
            customer (str, optional): The Stripe customer id. Defaults to None.
        """
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

    def payment_intent(self, request: HttpRequest, amount: int, products=[], stripe_params: dict[str, Any] = {}):
        """Create a new payment intent for the given amount

        Args:
            request: The current request object
            amount (int): The amount to be charged in euros
            products (list, optional): List of products in the cart. Defaults to [].
            stripe_params (dict, optional): Additional stripe parameters. Defaults to {}.
        """
        session_id = stripe_params.get('session_id')

        params = {
            'amount': self.adapt_number(amount),
            'setup_future_usage': 'off_session',
            'payment_method_types': ['card'],
            'idempotency_key': session_id,
            'automatic_payment_methods': {'enabled': False},
            'description': 'Customer order for products',
            'currency': 'eur',
            'metadata': {}
        }

        if request.user.is_authenticated:
            params['customer'] = request.user.userprofile.stripe_id
            params['receipt_email'] = request.user.email

        try:
            response = stripe.PaymentIntent.create(**params)
        except stripe.StripeError as e:
            self.errors['payment_error'] = e.args
            return False
        except Exception as e:
            self.errors['payment_error'] = e.args
            return False

        if self.errors:
            return False

        intent_id = response['id']
        client_secret = response['client_secret'].encode('utf-8')
        token = urlsafe_base64_encode(bytes(client_secret))

        self.payment_details.client_secret = token
        self.payment_details.payment_intent_id = intent_id
        self.completed = True
        return response

    def capture_intent(self, intent: str, payment_method: str):
        """Capture a previously created payment intent

        Args:
            intent (str): The id of the payment intent to capture
            payment_method (str): The payment method to use for capturing
        """
        try:
            response = stripe.PaymentIntent.confirm(
                intent,
                payment_method=payment_method
            )
        except stripe.StripeError as e:
            self.errors['payment_error'] = e.args
            return False
        except Exception as e:
            self.errors['payment_error'] = e.args
            return False

        self.completed = True
        return response

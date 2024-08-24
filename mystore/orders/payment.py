import dataclasses
import os

import stripe
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.response import Response

# def update_carrier(self, charge, customer, carrier, tracking_number):
#     try:
#         response = stripe.PaymentIntent.modify(
#             charge,
#             customer=customer,
#             shipping={
#                 'carrier': carrier,
#                 'tracking_number': tracking_number,
#             }
#         )
#     except stripe.StripeError as e:
#         self.errors['update_error'] = e.args
#     except Exception as e:
#         self.errors['update_error'] = e.args
#     else:
#         return True
#     finally:
#         if self.errors:
#             return False


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

    def create_new_source(self, customer, source):
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

    def payment_intent(self, request, amount, billing_adress, debug=False, products=[], stripe_params={}):
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
            'customer': request.user.userprofile.stripe_id,
            'description': 'Customer order for products',
            'metadata': {},
            'shipping': {
                'address': {
                    'line1': getattr(billing_adress, 'address_line'),
                    'line2': None,
                    'postal_code': getattr(billing_adress, 'zip_code'),
                    'city': getattr(billing_adress, 'city'),
                    'state': None,
                    'country': getattr(billing_adress, 'country'),
                },
                'name': billing_adress.get_full_name,
                'phone': getattr(billing_adress, 'telephone'),
                'carrier': None
            },
            'receipt_email': request.user.email,
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

# def refund(self, request, charge, reason=None):
#        try:
#             response = stripe.Refund.create(
#                 charge=charge,
#                 reason=None,
#                 metadata={}
#             )
#         except stripe.StripeError as e:
#             self.errors['update_error'] = e.args
#         except Exception as e:
#             self.errors['update_error'] = e.args
#         else:
#             return True
#         finally:
#             if self.errors:
#                 return False

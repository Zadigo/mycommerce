import os

import stripe
from django.conf import settings
from rest_framework.response import Response


class PaymentInterface:
    def __init__(self):
        self.completed = False
        self.response_data = {}
        # if settings.DEBUG:
        #     api_key = os.getenv('STRIPE_DEVELOPMENT_API_KEY')
        # else:
        #     api_key = os.getenv('STRIPE_PRODUCTION_API_KEY')
        # self.instance = stripe.StripeClient(api_key)
        pass

    def get_fail_response(self, **kwargs):
        data = {'message': 'Payment failed'} | kwargs
        return Response(data, status=402)

    def payment(self, amount, **kwargs):
        # params = self.instance.payment_intents.CreateParams(
        #     amount=amount,
        #     **kwargs
        # )
        # response = self.instance.payment_intents.capture('', params=params)
        self.completed = True


payment_interface = PaymentInterface()

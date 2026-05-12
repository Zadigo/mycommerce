from rest_framework.request import Request
import pathlib

class GolangPaymentRouter:
    """The GolangPaymentRouter class is responsible for handling HTTP requests 
    related to payment processing through the Golang microservice. It defines routes for 
    creating and updating payment intents, as well as capturing payments. The router uses 
    the PaymentInterface to perform the necessary operations and returns appropriate responses 
    based on the outcome of each request."""

    def __init__(self, request: Request):
        self.request = request
        self.route_url = 'http://127.0.0.1:9000/v1'

    @property
    def create_intent_url(self):
        return f"{self.route_url}/create-intent"

    @property
    def update_intent_url(self):
        return f"{self.route_url}/update-intent"
    
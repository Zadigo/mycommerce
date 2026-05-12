from rest_framework.request import Request
import httpx

class GolangPaymentRouter:
    """The GolangPaymentRouter class is responsible for handling HTTP requests 
    related to payment processing through the Golang microservice. It defines routes for 
    creating and updating payment intents, as well as capturing payments. The router uses 
    the PaymentInterface to perform the necessary operations and returns appropriate responses 
    based on the outcome of each request."""

    def __init__(self, request: Request):
        self.request = request
        self.route_url = 'http://127.0.0.1:9000/payment'

    def create_url(self, path: str) -> str:
        if not path.startswith('/'):
            path = f'/{path}'
        return f"{self.route_url}{path}"

    def ping(self):
        with httpx.Client() as client:
            response = client.get(self.create_url("ping"))
            response.raise_for_status()
            return response.json()

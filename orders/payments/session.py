from orders import stripe_initialized


class SessionBasedPayment:
    def __init__(self, request, **kwargs):
        self.request = request
        self.errors = []

    def execute_payment(self):
        pass

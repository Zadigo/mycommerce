from django.conf import settings
from django.utils.crypto import get_random_string

from mystore.custom_utilities.tokens import JWTGenerator


class CartJWTGenerator(JWTGenerator):
    """A JWT generator specifically created to generate unique
    tokens with a cart ID for identifying ensembles"""

    def __init__(self, **payload):
        issuer = getattr(settings, 'PY_UTILITIES_JWT_ISSUER')
        payload['cart_id'] = get_random_string(length=20)
        super().__init__(issuer, 'cart', 'cart', expiration_days=3, **payload)

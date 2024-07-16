from typing import List, Tuple, Union

import stripe
from django.conf import settings
from django.core.exceptions import ValidationError


def get_stripe_tokens() -> List[Tuple[str, str]]:
    try:
        stripe_tokens = settings.STRIPE_TOKENS
    except:
        raise ValidationError(
            'In order to use the cart application, please implement the STRIPE_TOKENS in the settings file')
    return stripe_tokens



def initialize_stripe():
    def parse_key(key_to_get: str, stripe_tokens: list) -> str:
        key = list(filter(lambda keys: key_to_get in keys, stripe_tokens))
        if not key:
            return ()
        return key[0][-1]

    stripe_tokens = get_stripe_tokens()

    if not isinstance(stripe_tokens, list):
        raise TypeError('The STRIPE_TOKENS should be a list')

    key_to_get = 'sk_test'
    if not settings.DEBUG:
        key_to_get = 'sk_live'

    stripe.api_key = parse_key(key_to_get, stripe_tokens)
    return stripe


stripe_initialized = initialize_stripe()

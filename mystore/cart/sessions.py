import datetime

import pytz
from django.utils.crypto import get_random_string, salted_hmac
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode

CART_SESSION_NAME = 'cart_session_id'


class BaseSessionManager:
    """A manager that allows the creation of session
    ids in order to identify anonymous users on that
    are shopping on the website"""

    default_prefix = 'ca'
    default_signature = 'django'

    def __init__(self, request):
        self.request = request
        self.cart_session_id = None

        try:
            self.cart_session_id = request.session.get(CART_SESSION_NAME, None)
        except:
            pass

    def __repr__(self):
        return f'{self.__class__.__name__}({self.cart_session_id})'

    def __str__(self):
        return str(self.cart_session_id)

    def __eq__(self, value):
        return self.cart_session_id == value

    @property
    def has_session_id(self):
        return self.cart_session_id is not None

    @classmethod
    def test_key(cls, key: str, known_signature: str = None):
        """Tests the signature part of the session key
        and the prefix."""
        signature, d, identifier = key.split('-')
        prefix, salted_signature = signature.split('_')

        # Ensure that the year part of the session
        # key matches the current year
        clean_date = urlsafe_base64_decode(d).decode()
        decoded_date = datetime.datetime.fromisoformat(clean_date)
        current_date = datetime.datetime.now(tz=pytz.UTC)

        # Ensure that the signature matches the default
        # one: ca --; pending that another signature
        # was not provided by the programmer
        known_signature = known_signature or cls.default_signature
        initial_signature = salted_hmac(
            cls.default_prefix,
            known_signature
        ).hexdigest()

        print(initial_signature)

        result = all([
            prefix == cls.default_prefix,
            salted_signature == initial_signature,
            decoded_date.year == current_date.year
        ])

        if result:
            return True
        return False

    @classmethod
    def create_session_key(cls, signature: str = None) -> str:
        """The cart session is composed on three main parts:

            * A signature
            * A base64 encoded UTC date
            * A random unique string identifier

        The signaure part is composed on two main parts:

            * A prefix: `ca_`
            * A salted hmac signature composed of the prefix and a signature
        """
        current_date = datetime.datetime.now(tz=pytz.UTC)
        unique_identifier = get_random_string(12)

        signature = signature or cls.default_signature
        final_signature = salted_hmac(
            cls.default_prefix,
            signature
        ).hexdigest()

        encoded_date = urlsafe_base64_encode(
            bytes(
                str(current_date).encode('utf-8')
            )
        )
        return f'{cls.default_prefix}_{final_signature}-{encoded_date}-{unique_identifier}'

    def get_or_create(self):
        """Check if there is a session id and
        if not create a new one, store and
        return it"""
        if self.cart_session_id is None:
            new_session_id = get_random_string(12)
            self.request.session[CART_SESSION_NAME] = new_session_id
            self.cart_session_id = new_session_id
        return self.cart_session_id

    def delete(self):
        self.request.session.pop(CART_SESSION_NAME)

    def get_response(self, using, params={}):
        return using(**params)


class RestSessionManager(BaseSessionManager):
    def __init__(self, request):
        self.request = request
        self.cart_session_id = None

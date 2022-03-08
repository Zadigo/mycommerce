from django.utils.crypto import get_random_string
from typing import Callable, Union

from django.apps import apps
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.forms import DecimalField


def get_product_model():
    try:
        return apps.get_model(settings.PRODUCT_MODEL, require_ready=False)
    except Exception as e:
        raise ImproperlyConfigured(e, 'In order to use this app, you need to define a product model in your settings file')


def calculate_vat(value: Union[DecimalField, float, int], vat: int=20):
    price = float(value)
    if vat < 0 or vat > 100:
        raise ValueError('VAT should be above 0 and below a 100')
    return price * (1 + (vat / 100))


CART_SESSION_NAME = 'cart_session_id'


class SessionManager:
    """A simple manager for dealing with creating or
    deleting cart ids in the user session"""
    
    def __init__(self, request):
        self.request = request
        self.cart_session_id = request.session.get(CART_SESSION_NAME, None)
        
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
    def create_session_key(cls):
        return get_random_string(12)
        
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
    
    def get_response(self, using: Callable, params: dict={}):
        return using(**params)

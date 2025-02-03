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
        raise ImproperlyConfigured(
            e, 'In order to use this app, you need to define a product model in your settings file')


def calculate_vat(value: Union[DecimalField, float, int], vat: int = 20):
    price = float(value)
    if vat < 0 or vat > 100:
        raise ValueError('VAT should be above 0 and below a 100')
    return price * (1 + (vat / 100))

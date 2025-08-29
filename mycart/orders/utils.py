from django.apps import apps
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured


def get_product_model():
    try:
        return apps.get_model(settings.PRODUCT_MODEL, require_ready=False)
    except Exception as e:
        raise ImproperlyConfigured(
            e, 'In order to use this app, you need to define a product model in your settings file')

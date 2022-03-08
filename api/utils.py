from typing import OrderedDict

from django.apps import apps
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.dispatch import Signal
from imagekit import ImageSpec
from imagekit.processors import ResizeToFill
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response

order_created = Signal()

def get_product_model():
    try:
        return apps.get_model(settings.PRODUCT_MODEL, require_ready=False)
    except:
        raise ImproperlyConfigured(
            'In order to use this app, you need to define a product model in your settings file')


class CustomPagination(LimitOffsetPagination):
    default_limit = 100
    max_limit = 100
    
    def get_paginated_response(self, data, **kwargs):
        return Response(OrderedDict([
            ('count', self.count),
            ('infos', kwargs.get('additional_infos')),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data)
        ]))


class CustomImageProcessor(ImageSpec):
    processors = [ResizeToFill(689, 1100)]
    format = 'JPEG'
    options = {'quality': 60}

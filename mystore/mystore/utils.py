import os

import stripe
import unidecode
from django.conf import settings
from rest_framework.pagination import LimitOffsetPagination


class CustomPagination(LimitOffsetPagination):
    default_limit = 34
    max_limit = 34


class PaginationHelper:
    """This pagination class allows us to modify the response
    dictionnary that is returned from `LimitOffsetPagination`.
    By passing keyword arguments to `get_custom_response_template`,
    the final response can be populated with additional values.

    >>> pagination_helper = PaginationHelper()
    ... pagination_helper(request, queryset, serializer_class)
    ... template = pagination_helper.get_custom_response_template()
    """

    paginator = CustomPagination()

    def __init__(self):
        self.queryset = []
        self.paginated_data = []
        self.serializer_instance = None

    def __call__(self, request, queryset, serializer, response_only=True):
        """Paginates a list of items using the
        CustomPagination class above and the serializer
        to be used in order to return the data"""
        paginated_data = self.paginator.paginate_queryset(
            queryset,
            request
        )
        serializer_instance = serializer(
            instance=paginated_data,
            many=True
        )
        self.serializer_instance = serializer_instance
        self.paginated_data = serializer_instance.data

        if response_only:
            return self.paginator.get_paginated_response(serializer_instance.data)
        return self

    def get_custom_response_template(self, **kwargs):
        """Creates a customized pagination template
        once the data has been paginated"""
        data = {
            'count': self.paginator.count,
            'next': self.paginator.get_next_link(),
            'previous': self.paginator.get_previous_link(),
            'results': self.paginated_data
        }
        return data | kwargs


def remove_accents(text):
    text = str(text)
    return unidecode.unidecode(text)


# TODO: Remove
def initialize_stripe():
    if settings.DEBUG:
        stripe.api_key = os.getenv('STRIPE_TEST_SECRET_KEY')
    else:
        stripe.api_key = os.getenv('STRIPE_PRODUCTION_API_KEY')

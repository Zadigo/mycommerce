import os
from urllib.parse import parse_qs, urlparse

import stripe
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
        self.total_count = 0
        self.paginated_data = []
        self.serializer_instance = None

    def __call__(self, request, queryset, serializer, response_only=True):
        """Paginates a list of items using the
        CustomPagination class above and the serializer
        to be used in order to return the data"""
        self.total_count = len(queryset)
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
        next_link = self.paginator.get_next_link()
        previous_link = self.paginator.get_previous_link()

        next_link_obj = urlparse(next_link)
        previous_link_obj = urlparse(previous_link)

        # For Nuxt, returning the full url which is the
        # default Django value is not usefull for us. We
        # only need the next and previous offset numbers
        # in order to paginate the products correctly
        next_offset_value = 0
        previous_offset_value = 0

        next_offset = parse_qs(next_link_obj.query)
        next_offset_value = next_offset.get('offset', None)
        if next_offset_value is not None:
            next_offset_value = int(next_offset_value[-1])

        previous_offset = parse_qs(previous_link_obj.query)
        previous_offset_value = previous_offset.get('offset', None)
        if previous_offset_value is not None:
            previous_offset_value = int(previous_offset_value[-1])

        data = {
            'count': self.total_count,
            'limit': self.paginator.limit,
            'next': next_offset_value,
            'previous': previous_offset_value,
            'results': self.paginated_data
        }
        return data | kwargs


# TODO: Remove
def initialize_stripe():
    if settings.DEBUG:
        stripe.api_key = os.getenv('STRIPE_TEST_SECRET_KEY')
    else:
        stripe.api_key = os.getenv('STRIPE_PRODUCTION_API_KEY')


from rest_framework.pagination import LimitOffsetPagination


class CustomPagination(LimitOffsetPagination):
    default_limit = 34
    max_limit = 34


class PaginationHelper:
    paginator = CustomPagination()

    def __init__(self):
        self.paginated_data = []
        self.serializer_instance = None

    def __call__(self, request, queryset, serializer, response_only=True):
        """Paginates a list of items using the
        CustomPagination class above and the serializer
        to be used in order to return the data"""
        self.paginated_data = self.paginator.paginate_queryset(
            queryset,
            request
        )
        serializer_instance = serializer(
            instance=self.paginated_data,
            many=True
        )
        self.serializer_instance = serializer_instance
        if response_only:
            return self.paginator.get_paginated_response(serializer_instance.data)
        return self

    def get_template(self, **kwargs):
        """Creates a customized pagination template
        once the data has been paginated"""
        data = {
            'count': self.paginator.count,
            'next': self.paginator.get_next_link(),
            'previous': self.paginator.get_previous_link(),
            'results': self.paginated_data
        }
        return data | kwargs


pagination_helper = PaginationHelper()

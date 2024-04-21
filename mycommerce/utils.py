
from rest_framework.pagination import LimitOffsetPagination


class CustomPagination(LimitOffsetPagination):
    default_limit = 34
    max_limit = 34


def pagination_helper(request, queryset, serializer, response_only=True):
    """Paginates a list of items using the
    CustomPagination class above and the serializer
    to be used in order to return the data"""
    paginator = CustomPagination()
    result = paginator.paginate_queryset(queryset, request)
    serializer_instance = serializer(instance=result, many=True)
    if response_only:
        return paginator.get_paginated_response(serializer_instance.data)
    return paginator, serializer_instance

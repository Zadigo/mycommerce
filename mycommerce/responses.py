from typing import Union

from django.db.models.query import QuerySet
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from rest_framework.pagination import LimitOffsetPagination

class CustomPagination(LimitOffsetPagination):
    default_limit = 100
    max_limit = 100


def api_response(serializer: Serializer=None, data: Union[list, dict]=None, queryset: QuerySet=None, has_many: bool=False):
    if serializer is not None:
        if queryset is None:
            raise ValueError('This requires a queryst' )
        serializer = serializer(instance=queryset, many=has_many)
        return Response(data=serializer.data)
    elif data is not None:
        return Response(data=data)
    raise ValueError('Both data and queryset is None')

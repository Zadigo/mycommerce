from typing import Union

from django.db.models.query import QuerySet
from numpy import isin
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework.serializers import ListSerializer, Serializer


class CustomPagination(LimitOffsetPagination):
    default_limit = 100
    max_limit = 100


def api_response(serializer: Serializer=None, data: Union[list, dict]=None, queryset: QuerySet=None, has_many: bool=False):
    if serializer is not None:
        if queryset is None:
            raise ValueError('This requires a queryset' )
        serializer = serializer(instance=queryset, many=has_many)
        return Response(data=serializer.data)
    elif data is not None:
        return Response(data=data)
    raise ValueError('Both data and queryset is None')


def simple_api_response(data_or_serializer):
    data = None
    if isinstance(data_or_serializer, (Serializer, ListSerializer)):
        data = data_or_serializer.data
    else:
        data = data_or_serializer
    return Response(data=data)

from typing import OrderedDict, Tuple

from rest_framework import fields
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework.serializers import Serializer
import re

class CommaSeperatedField(fields.Field):
    def to_internal_value(self, data):
        result = re.match(r'(\w+)\,', data)
        if result:
            return list(result.groups())
        self.fail('invalid', input=data)
        
    def to_representation(self, value):
        tokens = value


class CustomPagination(LimitOffsetPagination):
    default_limit = 100

    def get_response_dict(self, data) -> dict:
        """Custom view that returns just the dictionnary
        to be sent via the Response class"""
        return OrderedDict([
            ('count', self.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data)
        ])


def paginate_data(request, queryset, serializer, has_many=False) -> Tuple[CustomPagination, Serializer, Response]:
    instance = CustomPagination()
    result = instance.paginate_queryset(queryset, request)
    serializer_instance = serializer(instance=result, many=has_many)
    response = instance.get_paginated_response(serializer_instance.data)
    return instance, serializer_instance, response


class CollectionSerializer(Serializer):
    name = fields.CharField()
    category = fields.CharField()
    illustration = fields.ImageField()
    tags = fields.CharField()
    get_view_name = fields.CharField()

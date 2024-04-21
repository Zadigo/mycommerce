import json

import pandas
from rest_framework import fields
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.serializers import Serializer

from shop.models import Image, Product


class CustomPagination(LimitOffsetPagination):
    default_limit = 34
    max_limit = 34


class ProductSerializer(Serializer):
    """Serializer used for sending data
    to agents that require displaying all
    the product information"""

    id = fields.IntegerField()
    name = fields.CharField()
    category = fields.CharField()
    unit_price = fields.DecimalField(5, 2)
    get_price = fields.DecimalField(5, 2)
    active = fields.BooleanField()


class AdminProductSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField()
    unit_price = fields.DecimalField(5, 2)
    active = fields.BooleanField()


class ImageProductSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField()


class ImageSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField()
    product_set = ImageProductSerializer(many=True)
    original = fields.FileField()
    thumbnail = fields.FileField()
    mid_size = fields.FileField()


class ValidateImageFilter(Serializer):
    column = fields.CharField()
    operator = fields.CharField()
    value = fields.CharField()


class ValidateImageFiltersSerializer(Serializer):
    image_filters = ValidateImageFilter(many=True)

    def filter_images(self):
        queryset = Image.objects.all()
        serializer = ImageSerializer(instance=queryset, many=True)
        df = pandas.DataFrame(serializer.data)
        operators = self.validated_data['image_filters']
        operator_formats = {
            'Equals': "{lhv} == '{value}'"
        }
        for operator in operators:
            operator_format = operator_formats[operator['operator']]
            result = operator_format.format_map({
                'lhv': operator['column'].lower(),
                'value': operator['value']
            })
            df = df.query(result)
        return json.loads(df.to_json(orient='records', force_ascii=False))

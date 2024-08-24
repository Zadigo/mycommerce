from rest_framework.serializers import Serializer
from rest_framework import fields


class DiscountSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField()
    percentage = fields.IntegerField()
    remaining_days = fields.IntegerField()

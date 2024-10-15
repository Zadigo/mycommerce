from rest_framework.serializers import Serializer
from rest_framework import fields
from discounts.utils import calculate_discount


class DiscountSerializer(Serializer):
    id = fields.IntegerField(read_only=True)
    name = fields.CharField(read_only=True)
    percentage = fields.IntegerField(read_only=True)
    remaining_days = fields.IntegerField(read_only=True)

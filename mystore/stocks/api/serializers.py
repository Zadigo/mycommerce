from rest_framework import fields
from rest_framework.serializers import Serializer
from variants.api.serializers import SizeSerializer


class SizeSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField()


class StockSerializer(Serializer):
    id = fields.IntegerField()
    variant = SizeSerializer()
    quantity = fields.IntegerField()
    in_stock = fields.BooleanField()
    almost_sold_out = fields.BooleanField()
    customer_order = fields.CharField()
    is_active = fields.BooleanField()


class UpdateStockSerializer(Serializer):
    id = fields.IntegerField(read_only=True)
    quantity = fields.IntegerField(read_only=True)
    customer_order = fields.CharField(write_only=True)

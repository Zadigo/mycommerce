from rest_framework import fields
from rest_framework.serializers import Serializer


class ProductSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField()


class StockSerializer(Serializer):
    product = ProductSerializer()
    quantity = fields.IntegerField()
    # in_stock = fields.BooleanField(default=True)
    # almost_sold_out = fields.BooleanField(default=False)
    is_active = fields.BooleanField(default=True)


class UpdateStockSerializer(Serializer):
    id = fields.IntegerField(read_only=True)
    customer_order = fields.CharField(write_only=True)
    product = ProductSerializer(read_only=True)
    # in_stock = fields.BooleanField(read_only=True)
    # almost_sold_out = fields.BooleanField(read_only=True)

from rest_framework import fields
from rest_framework.serializers import Serializer

from shop.api.serializers.shop import ProductSerializer


class StockSerializer(Serializer):
    product = ProductSerializer()
    quantity = fields.IntegerField()
    in_stock = fields.BooleanField(default=True)
    almost_sold_out = fields.BooleanField(default=False)
    is_active = fields.BooleanField(default=True)

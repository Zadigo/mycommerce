from rest_framework import fields
from rest_framework.serializers import Serializer

from shop.serializers import ProductSerializer


class StockSerializer(Serializer):
    reference = fields.CharField()
    product = ProductSerializer()
    isle = None
    quantity = fields.IntegerField()
    in_stock = fields.BooleanField(default=True)
    almost_sold_out = fields.BooleanField(default=False)

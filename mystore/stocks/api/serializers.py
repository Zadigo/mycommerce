from rest_framework import fields
from rest_framework.serializers import Serializer
from cart.api.serializers import cart_statistics
from cart.models import Cart
from django.db.models import F
from stocks.models import Stock



class ProductSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField()


class StockSerializer(Serializer):
    id = fields.IntegerField(read_only=True)
    product = ProductSerializer(read_only=True)
    quantity = fields.IntegerField(read_only=True)
    in_stock = fields.BooleanField(default=True, read_only=True)
    almost_sold_out = fields.BooleanField(default=False, read_only=True)
    customer_order = fields.CharField(write_only=True)
    is_active = fields.BooleanField(default=True, read_only=True)

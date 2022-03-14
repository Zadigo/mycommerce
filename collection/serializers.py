from rest_framework import fields
from rest_framework.serializers import Serializer
from shop.serializers import ProductSerializer


class CollectionSerializer(Serializer):
    name = fields.CharField()
    category = fields.CharField()
    # products = ProductSerializer(many=True)
    illustration = fields.ImageField()
    tags = fields.CharField()
    get_view_name = fields.CharField()

from rest_framework import fields
from rest_framework.serializers import Serializer
from api.serializers.products import ImageSerializer


class SimpleProductSerializer(Serializer):
    id = fields.IntegerField()
    images = ImageSerializer(many=True)
    slug = fields.SlugField()
    

class ProductHistorySerializer(Serializer):
    id = fields.IntegerField()
    product = SimpleProductSerializer()
    unit_price = fields.DecimalField(5, 2)


class CustomerOrderSerializer(Serializer):    
    id = fields.IntegerField()
    reference = fields.CharField()
    products = ProductHistorySerializer(many=True)
    total = fields.DecimalField(5, 2)
    created_on = fields.DateTimeField()


class ValidateCustomerOrder(Serializer):
    pass

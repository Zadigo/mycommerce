from typing import Tuple
from django.shortcuts import get_object_or_404
from api.serializers.products import ProductSerializer
from api.utils import get_product_model
from cart.models import Cart
from rest_framework import fields
from rest_framework.serializers import Serializer

PRODUCT_MODEL = get_product_model()


class CartSerializer(Serializer):
    id = fields.IntegerField()
    product = ProductSerializer()
    quantity = fields.CharField()
    total = fields.DecimalField(5, 2)
    created_on = fields.DateTimeField()


class ValidateCart(Serializer):
    product = fields.IntegerField(required=True)
    quantity = fields.IntegerField(default=1)
    # variant = fields.CharField(allow_null=True)

    def create(self, validated_data, request=None) -> Tuple:
        data = validated_data.copy()
        product = get_object_or_404(PRODUCT_MODEL, id=data['product'])
        data['product'] = product
        return Cart.objects.add_to_cart(request, **data)

    def save(self, request, **kwargs):
        validated_data = {**self.validated_data, **kwargs}

        if self.instance is not None:
            self.instance = self.update(self.instance, validated_data)
        else:
            result = self.create(validated_data, request=request)
            self.instance = result[0]

        return result

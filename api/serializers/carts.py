from ctypes import Union
from typing import Tuple, Type
from django.shortcuts import get_object_or_404
from api.serializers.products import ProductSerializer
from api.utils import get_product_model
from cart.models import Cart
from rest_framework import fields
from shop.choices import ClotheSizes
from django.db.models import QuerySet
from rest_framework.serializers import Serializer

PRODUCT_MODEL = get_product_model()


class CartSerializer(Serializer):
    id = fields.IntegerField()
    product = ProductSerializer()
    quantity = fields.CharField()
    total = fields.DecimalField(5, 2)
    created_on = fields.DateTimeField()


class ValidateVariants(Serializer):
    size = fields.ChoiceField(
        ClotheSizes.sizes, 
        default=ClotheSizes.default('S')
    )


class ValidateCart(Serializer):
    product = fields.IntegerField()
    variants = ValidateVariants()
    session_id = fields.CharField(allow_null=True)
    is_gift = fields.BooleanField(default=False)
    
    def create(self, validated_data, request=None):
        data = validated_data.copy()
        product_id = data.pop('product')
        product = get_object_or_404(PRODUCT_MODEL, id=product_id)
        return Cart.objects.rest_api_add_to_cart(product, **data)

    def save(self, request, **kwargs) -> Tuple[str, QuerySet]:
        validated_data = {**self.validated_data, **kwargs}

        if self.instance is not None:
            return self.update(self.instance, validated_data)
        return self.create(validated_data, request=request)


class ValidateCartSession(Serializer):
    session_id = fields.CharField(required=True)

    def save(self, **kwargs):
        return Cart.objects.cart_products(session_id=self.validated_data['session_id'])
    
    def delete(self, product_id, **kwargs):
        item = get_object_or_404(Cart, id=product_id, session_id=self.validated_data['session_id'])
        item.delete()
        return item

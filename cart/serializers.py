from typing import Tuple

from api.utils import get_product_model
from django.db.models import Count, QuerySet, Sum
from django.shortcuts import get_object_or_404
from rest_framework import fields
from rest_framework.serializers import Serializer
from shop.choices import ClotheSizesChoices
from shop.serializers import ProductSerializer

from cart.models import Cart

PRODUCT_MODEL = get_product_model()


def cart_statistics(queryset):
    values = queryset.values('product__name')
    grouped = values.annotate(count=Count('product__name'), total=Sum('price'))
    return grouped.order_by()


def build_cart_response(queryset, session_id):
    serializer = CartSerializer(instance=queryset, many=True)
    response_data = {
        'session_id': session_id,
        'results': serializer.data,
        'statistics': cart_statistics(queryset)
    }
    response_data = response_data | queryset.aggregate(total=Sum('price'))
    return response_data


class CartSerializer(Serializer):
    id = fields.IntegerField()
    product = ProductSerializer()
    default_size = fields.CharField()
    price = fields.DecimalField(5, 2)
    created_on = fields.DateTimeField()


class ValidateVariants(Serializer):
    size = fields.ChoiceField(
        ClotheSizesChoices.sizes,
        default=ClotheSizesChoices.default('S')
    )
    

class ValidateCart(Serializer):
    product = fields.IntegerField(allow_null=True)
    default_size = fields.ChoiceField(
        ClotheSizesChoices.choices(),
        default=ClotheSizesChoices.default('Unique')
    )
    session_id = fields.CharField(allow_null=True)

    def list_items(self, **kwargs):
        session_id = self.validated_data['session_id']
        return Cart.objects.cart_items(session_id=session_id)

    def create(self, validated_data, request=None):
        data = validated_data.copy()
        product_id = data.pop('product')
        product = get_object_or_404(PRODUCT_MODEL, id=product_id)
        return Cart.objects.rest_api_add_to_cart(request, product, **data)

    def save(self, request, **kwargs) -> Tuple[str, QuerySet]:
        validated_data = {**self.validated_data, **kwargs}

        if self.instance is not None:
            return self.update(self.instance, validated_data)
        return self.create(validated_data, request=request)
    
    def delete(self, product_id, **kwargs):
        session_id = self.validated_data['session_id']
        if product_id is not None:
            item = get_object_or_404(Cart, id=product_id, session_id=session_id)
            item.delete()
        return Cart.objects.filter(session_id__iexact=session_id)


# class ValidateCartSession(Serializer):
#     session_id = fields.CharField(required=True)

#     def list_items(self, **kwargs):
#         session_id = self.validated_data['session_id']
#         return Cart.objects.cart_items(session_id=session_id)

#     def delete(self, product_id, **kwargs):
#         session_id = self.validated_data['session_id']
#         item = get_object_or_404(Cart, id=product_id, session_id=session_id)
#         item.delete()
#         return Cart.objects.filter(session_id__iexact=session_id)

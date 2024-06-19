from django.db.models import Count, Sum
from django.shortcuts import get_object_or_404
from rest_framework import fields
from rest_framework.serializers import Serializer

from cart.models import Cart
from orders.choices import ShipmentChoices
from shop.api.serializers.shop import ProductSerializer
from shop.choices import ClotheSizesChoices
from shop.models import Product


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
    """Serializes the cart objects"""

    id = fields.IntegerField()
    product = ProductSerializer()
    size = fields.CharField()
    price = fields.DecimalField(5, 2)
    created_on = fields.DateTimeField()


class ValidateVariants(Serializer):
    size = fields.ChoiceField(
        ClotheSizesChoices.sizes,
        default=ClotheSizesChoices.default('S')
    )


class ValidateProduct(Serializer):
    id = fields.IntegerField()
    color = fields.CharField()


class ValidateCart(Serializer):
    """Validates the data used to create a
    cart item in the database"""

    product = ValidateProduct()
    size = fields.CharField(allow_null=True)
    session_id = fields.CharField(allow_null=True)

    def list_items(self, **kwargs):
        session_id = self.validated_data['session_id']
        return Cart.objects.cart_items(session_id=session_id)

    def create(self, validated_data):
        data = validated_data.copy()
        product_id = data.pop('product')['id']
        product = get_object_or_404(Product, id=product_id)
        return Cart.objects.rest_api_add_to_cart(self.request, product, **data)

    def save(self, request, **kwargs):
        setattr(self, 'request', request)
        return super().save(**kwargs)

    def delete(self, request, **kwargs):
        product_id = self.validated_data['product']
        session_id = self.validated_data['session_id']
        return Cart.objects.remove_from_cart(request, product_id, session_id)


class ValidateShipment(Serializer):
    session_id = fields.CharField()
    email = fields.CharField()
    firstname = fields.CharField()
    lastname = fields.CharField()
    address = fields.CharField()
    zip_code = fields.CharField()
    city = fields.CharField()
    country = fields.CharField()
    telephone = fields.CharField()
    delivery_option = fields.ChoiceField(
        ShipmentChoices.choices,
        default=ShipmentChoices.COLISSIMO_STANDARD
    )

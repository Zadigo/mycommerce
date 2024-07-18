from django.db.models import Count, Sum
from django.shortcuts import get_object_or_404
from rest_framework import fields
from rest_framework.serializers import Serializer

from cart.models import Cart
from shop.api.serializers.shop import ProductSerializer
from shop.choices import ClotheSizesChoices
from shop.models import Product


def cart_statistics(queryset):
    """Helper function that groups each products
    from the cart and returns the total quantity
    and the total sum to pay for that product group"""
    values = queryset.values('product__id', 'product__name')
    grouped = values.annotate(
        quantity=Count('product__name'),
        total=Sum('price')
    )
    return grouped.order_by()


def build_cart_response(queryset, session_id):
    """A special helper class that resolves the
    queryset, that resolves the total count for
    each product in the cart and returns a valid
    dictionnary response for adding an object in
    the user's cart

        {
            'session_id': '...', 
            'results': [
                { 
                    'id': '...', # cart id
                    'product': {...},
                    'size': '...', 
                    'color': '...', 
                    'price': '...',
                    'created_on': '...'
                }
            ],
            'statistics': [
                {
                    'product__id': '...',
                    'product__name': '...',
                    'quantity': '...',
                    'total': '...'
                }
            ],
            'total': '...'
        }
    """
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
    # color = fields.CharField()
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
    new cart object in the database"""

    def __init__(self, request, **kwargs):
        super().__init__(**kwargs)
        self._request = request

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
        return Cart.objects.rest_api_add_to_cart(self._request, product, **data)

    def delete(self, **kwargs):
        product_id = self.validated_data['product']
        session_id = self.validated_data['session_id']
        return Cart.objects.remove_from_cart(self._request, product_id, session_id)

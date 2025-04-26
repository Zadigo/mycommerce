from cart.models import Cart
from cart.validators import validate_quantity
from django.db.models import Count, QuerySet, Sum
from django.db.models.manager import BaseManager
from django.db.models import QuerySet
from django.shortcuts import get_object_or_404
from rest_framework import fields
from rest_framework.serializers import Serializer
from shop.api.serializers import ProductSerializer
from shop.choices import ClotheSizesChoices
from shop.models import Product


def cart_statistics(queryset: BaseManager[Cart]):
    """Helper function that groups each products
    from the cart and aggregates them in order to return
    the total quantity of each products, their total sum or
    any other useful pieces of information for Nuxt"""
    values = queryset.values('product__id', 'product__name', 'size')
    grouped = values.annotate(
        quantity=Count('product__name'),
        total=Sum('price')
    )
    return grouped.order_by()


def build_cart_response(queryset: BaseManager[Cart], session_id: str):
    """A special helper class that resolves the
    queryset, that resolves the total count for
    each product in the cart and returns a valid
    dictionnary response for adding an object in
    the user's cart

    >>> {
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

    * "results" are the products that are currently in the user's cart
    * "statistics" are the aggregation of the quantity and price
    * "total" is the total of the price of the products in the cart
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
    session_id = fields.CharField(write_only=True)


class ValidateVariants(Serializer):
    size = fields.ChoiceField(
        ClotheSizesChoices.sizes,
        default=ClotheSizesChoices.default('S')
    )


class ValidateProduct(Serializer):
    """Serializer that validates the product
    is going to be added contains an `id`, a `size`
    and a `color`"""

    id = fields.IntegerField()
    size = fields.CharField(
        required=False,
        allow_null=True
    )
    color = fields.CharField(
        required=False,
        allow_null=True
    )


class ValidateCart(Serializer):
    """Validates the data used to create a
    new cart object in the database"""

    product = ValidateProduct(write_only=True)
    size = fields.CharField(write_only=True, default='Unique')
    session_id = fields.CharField(allow_null=True)
    results = fields.JSONField(read_only=True)
    statistics = fields.JSONField(read_only=True)
    total = fields.FloatField(read_only=True)

    def create(self, validated_data):
        request = self._context['request']

        data = validated_data.copy()
        product_id = data.pop('product')['id']
        product = get_object_or_404(Product, id=product_id)
        return Cart.objects.rest_api_add_to_cart(request, product, **data)

    def update(self, instance, validated_data):
        product_id = validated_data['product']['id']
        if instance.id == product_id:
            if instance.size == validated_data['size']:
                pass
        return instance


class DeleteFromCartSerializer(Serializer):
    session_id = fields.CharField()
    product_id = fields.IntegerField()  # ID of the item in the cart
    size = fields.CharField(default='Unique')

    def delete(self):
        request = self._context['request']

        product_id = self.validated_data['product_id']
        size = self.validated_data['size']
        session_id = self.validated_data['session_id']
        
        qs = Cart.objects.items_to_remove(request, product_id, session_id, size=size)
        for item in qs:
            item.delete()
        
        return qs


class ValidateIncreaseDecreaseSerializer(Serializer):
    product = ValidateProduct()
    method = fields.ChoiceField(
        [
            ('Increase', 'Increase'),
            ('Descrease', 'Decrease')
        ],
        default='Increase'
    )
    quantity = fields.IntegerField(validators=[validate_quantity])

    def update(self, instance, validated_data):
        product = get_object_or_404(
            Product,
            id=validated_data['product']['id']
        )

        stock = instance.stock_set.all()
        if stock.exists():
            pass

        if validated_data['method'] == 'Increase':
            new_objects = map(
                Cart(product=product),
                range(1, validated_data['quantity']
                      )
            )
            instances = Cart.objects.bulk_create(new_objects)
        elif validated_data['method'] == 'Decrease':
            pass
        return instance

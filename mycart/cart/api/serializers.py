import re
from cart.models import Cart
from cart.validators import validate_quantity
from django.db.models import Count, Sum
from django.db.models.manager import BaseManager
from django.shortcuts import get_object_or_404
from orders.models import Product
from rest_framework import fields
from rest_framework.serializers import Serializer
from cart import tasks


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


# class StoreProductSerializer(Serializer):
#     """A serializer used to adapt a product that comes from
#     the store to a usable object in the cart"""

#     id = fields.IntegerField()
#     name = fields.CharField()
#     sku = fields.CharField()
#     main_image = fields.URLField()
#     unit_price = fields.DecimalField(5, 2)


class CartSerializer(Serializer):
    """Serializes the cart objects"""

    id = fields.IntegerField()
    session_id = fields.CharField(write_only=True)
    product = fields.JSONField()
    size = fields.CharField()
    price = fields.DecimalField(5, 2)
    created_on = fields.DateTimeField()


# class ValidateVariants(Serializer):
#     size = fields.ChoiceField(
#         ClotheSizesChoices.sizes,
#         default=ClotheSizesChoices.default('S')
#     )


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

    id = fields.IntegerField(read_only=True)
    session_id = fields.CharField(required=True)
    items = fields.JSONField(write_only=True)

    def create(self, validated_data):
        request = self._context['request']

        instance = Cart.objects.create(
            session_id=validated_data['session_id'],
            items=validated_data['items']
        )
        tasks.calculate_total.apply_async(
            args=[instance.id],
            countdown=10
        )

        return instance

    def update(self, instance, validated_data):
        instance.items = validated_data['items']
        tasks.calculate_total.apply_async(args=[instance.id], countdown=5)
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

        qs = Cart.objects.items_to_remove(
            request, product_id, session_id, size=size)
        for item in qs:
            item.delete()

        return qs

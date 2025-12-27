
from cart import tasks
from cart.models import Cart
from rest_framework import fields
from rest_framework.serializers import Serializer


class _SizeSerializer(Serializer):
    """Serializes the size object
    inside the cart item objects"""

    name = fields.CharField()
    active = fields.BooleanField()
    metric = fields.CharField()
    availability = fields.BooleanField()
    variantPrice = fields.FloatField()


class CartItemMainImageSerializer(Serializer):
    """Serializes the main image
    inside the cart item objects"""

    name = fields.CharField()
    variant = fields.CharField()
    original = fields.CharField()
    createdOn = fields.CharField()
    thumbnail = fields.CharField()
    isMainImage = fields.BooleanField()


class _ProductSerializer(Serializer):
    """Serializes the product object
    inside the cart item objects"""

    id = fields.IntegerField()
    name = fields.CharField()
    price = fields.FloatField()
    salePrice = fields.FloatField()
    unitPrice = fields.FloatField()
    mainImage = CartItemMainImageSerializer()


class CartItemSerializer(Serializer):
    """Serializes the cart item objects that come
    directly from Firebase in Nuxt4"""

    size = _SizeSerializer()
    total = fields.FloatField()
    product = _ProductSerializer()
    quantity = fields.IntegerField()


class CartSerializer(Serializer):
    """Serializes the car objects"""

    id = fields.IntegerField()
    session_id = fields.CharField()
    items = fields.JSONField()
    total = fields.FloatField()
    quantity = fields.IntegerField()
    is_paid_for = fields.BooleanField()
    created_on = fields.DateTimeField()


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


class ValidateCreateCart(Serializer):
    """Validates the data used to create a
    new cart object in the database"""

    session_id = fields.CharField(required=True)
    items = CartItemSerializer(required=True, many=True)

    def create(self, validated_data):
        request = self._context['request']
        instance, created = Cart.objects.update_or_create(
            session_id=validated_data['session_id'],
            defaults={'items': validated_data['items']}
        )

        if request.user.is_authenticated:
            instance.user = request.user
            instance.save()

        tasks.calculate_total.apply_async(
            args=[instance.id],
            countdown=10
        )

        return instance

    def update(self, instance, validated_data):
        instance.items = validated_data['items']
        tasks.calculate_total.apply_async(
            args=[instance.id],
            countdown=5
        )
        return instance


class DeleteFromCartSerializer(Serializer):
    session_id = fields.CharField()
    product_ids = fields.ListField(child=fields.IntegerField())

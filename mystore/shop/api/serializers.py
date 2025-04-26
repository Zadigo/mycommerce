from django.forms import ValidationError
from collection.api.serializers import CollectionSerializer
from rest_framework import fields
from rest_framework.serializers import Serializer
from variants.api.serializers import SizeSerializer


class ImageProductSerializer(Serializer):
    """Serializer for a product in a set
    of products to list for a given image"""

    id = fields.IntegerField()
    name = fields.CharField()
    color = fields.CharField()
    color_variant_name = fields.CharField()


class ImageSerializer(Serializer):
    id = fields.IntegerField(read_only=True)
    name = fields.CharField(read_only=True)
    product_set = ImageProductSerializer(read_only=True, many=True)
    original = fields.FileField(read_only=True)
    thumbnail = fields.FileField(read_only=True)
    mid_size = fields.FileField(read_only=True)
    is_main_image = fields.BooleanField(read_only=True)


class ColorVariantProductSerializer(Serializer):
    """Serializer used for sending data
    to agents that require displaying
    the color variants of a product"""

    id = fields.IntegerField()
    color = fields.CharField()
    get_main_image = ImageSerializer(required=False)
    active = fields.BooleanField()


class ProductSerializer(Serializer):
    """Serializer used for sending data
    to agents that require displaying all
    the product information"""

    id = fields.IntegerField()
    name = fields.CharField()
    color = fields.CharField()
    category = fields.CharField()
    sub_category = fields.CharField()
    sizes = SizeSerializer(many=True)
    has_sizes = fields.BooleanField()
    unit_price = fields.DecimalField(5, 2)
    get_price = fields.DecimalField(5, 2)
    sale_value = fields.IntegerField()
    sale_price = fields.DecimalField(5, 2)
    on_sale = fields.BooleanField()
    collection_set = CollectionSerializer(many=True)
    get_main_image = ImageSerializer(required=False)
    images = ImageSerializer(many=True, required=False)
    model_height = fields.CharField()
    model_size = fields.CharField()
    # video = VideoSerializer(required=False)
    color_variant_name = fields.CharField()
    is_new = fields.BooleanField()
    active = fields.BooleanField()
    display_new = fields.BooleanField()
    slug = fields.SlugField(required=False)
    modified_on = fields.DateField(required=False)
    created_on = fields.DateField(required=False)


class LikeSerializer(Serializer):
    id = fields.IntegerField(read_only=True)
    product_ids = fields.ListField(write_only=True)
    name = fields.CharField(read_only=True)
    get_price = fields.IntegerField(read_only=True)

    def validate(self, attrs):
        product_ids = attrs['product_ids']
        for item in product_ids:
            if not isinstance(item, int):
                raise fields.ValidationError(detail={
                    'product_ids': 'ID is not valid'
                })
        return attrs


class WishlistSerializer(Serializer):
    session_id = fields.CharField()
    products = fields.ListField()

    def validate_products(self, value):
        for item in value:
            if not isinstance(item, int):
                raise ValidationError('Products are not valid')
        return value

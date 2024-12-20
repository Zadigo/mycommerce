
from rest_framework import fields
from rest_framework.serializers import Serializer

from collection.api.serializers import CollectionSerializer
from variants.api.serializers import SizeSerializer


class ImageProductSerializer(Serializer):
    """Serializer for a product in a set
    of products to list for a given image"""

    id = fields.IntegerField()
    name = fields.CharField()
    # TODO: Implement rest of fields
    # variant = fields.CharField()
    # mid_size = fields.ImageField()
    # thumbnail = fields.ImageField()
    # is_main_image = fields.BooleanField()


class ImageSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField()
    product_set = ImageProductSerializer(many=True)
    original = fields.FileField()
    thumbnail = fields.FileField()
    mid_size = fields.FileField()


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
    get_price = fields.DecimalField(5, 2)
    sale_value = fields.IntegerField()
    sale_price = fields.DecimalField(5, 2)
    on_sale = fields.BooleanField()
    collection_set = CollectionSerializer(many=True)
    get_main_image = ImageSerializer(required=False)
    images = ImageSerializer(many=True, required=False)
    # video = VideoSerializer(required=False)
    color_variant_name = fields.CharField()
    is_new = fields.BooleanField()
    active = fields.BooleanField()
    display_new = fields.BooleanField()
    slug = fields.SlugField(required=False)
    modified_on = fields.DateField(required=False)
    created_on = fields.DateField(required=False)


class LikeSerializer(Serializer):
    pass

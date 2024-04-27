
from rest_framework import fields
from rest_framework.serializers import Serializer

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


class ProductSerializer(Serializer):
    """Serializer used for sending data
    to agents that require displaying all
    the product information"""

    id = fields.IntegerField()
    name = fields.CharField()
    category = fields.CharField()
    color = fields.CharField()
    category = fields.CharField()
    sizes = SizeSerializer(many=True)
    get_price = fields.DecimalField(5, 2)
    active = fields.BooleanField()

    # TODO: Implement the remaning fields
    # id = fields.IntegerField()
    # name = fields.CharField(required=False)
    # unit_price = fields.DecimalField(5, 2, required=False)
    # usd_unit_price = fields.DecimalField(5, 2, required=False)

    # # additional_variants = AdditionalVariantSerializer(many=True, required=False)
    get_main_image = ImageSerializer(required=False)
    images = ImageSerializer(many=True, required=False)
    # video = VideoSerializer(required=False)

    # get_price = fields.DecimalField(5, 2)
    # sale_value = fields.IntegerField()
    # sale_price = fields.DecimalField(5, 2)
    # on_sale = fields.BooleanField()

    # display_new = fields.BooleanField()
    slug = fields.SlugField(required=False)
    modified_on = fields.DateField(required=False)
    created_on = fields.DateField(required=False)

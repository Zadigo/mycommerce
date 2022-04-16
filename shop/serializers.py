from rest_framework import fields
from rest_framework.serializers import Serializer, ModelSerializer
from rest_framework.serializers import raise_errors_on_nested_writes
from shop.models import Wishlist


class AdditionalVariantSerializer(Serializer):
    id = fields.IntegerField()

    name = fields.CharField()
    category = fields.CharField()
    sub_category = fields.CharField()
    # unit_price = fields.DecimalField(5, 2)

    in_stock = fields.BooleanField()
    active = fields.BooleanField()


class ImageSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField()
    variant = fields.CharField()

    mid_size = fields.ImageField()
    thumbnail = fields.ImageField()

    is_main_image = fields.BooleanField()


class VideoSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField()
    content = fields.FileField()


class ProductSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField(required=False)
    unit_price = fields.DecimalField(5, 2, required=False)

    color = fields.CharField()
    category = fields.CharField()
    additional_variants = AdditionalVariantSerializer(many=True, required=False)
    get_main_image = ImageSerializer(required=False)
    images = ImageSerializer(many=True, required=False)
    video = VideoSerializer(required=False)

    get_price = fields.DecimalField(5, 2)
    sale_value = fields.IntegerField()
    sale_price = fields.DecimalField(5, 2)
    on_sale = fields.BooleanField()

    active = fields.BooleanField(required=False)
    display_new = fields.BooleanField()
    slug = fields.SlugField(required=False)
    modified_on = fields.DateField(required=False)
    created_on = fields.DateField(required=False)


class VariantSerializer(Serializer):
    id = fields.IntegerField()
    color = fields.CharField()
    display_new = fields.BooleanField()
    slug = fields.SlugField()
    modified_on = fields.DateField()
    created_on = fields.DateField()


class UserlistSerializer(Serializer):
    id = fields.IntegerField()
    products = ProductSerializer(many=True)


class WishlistSerializer(UserlistSerializer):
    name = fields.CharField()


class ValidateWishList(Serializer):
    name = fields.CharField()
    
    def save(self, request, **kwargs):
        data = self.validated_data.copy()
        data['user'] = request.user
        instance, state = Wishlist.objects.get_or_create(**data)
        return WishlistSerializer(instance=instance)


class LikeSerializer(UserlistSerializer):
    id = fields.IntegerField()
    products = ProductSerializer(many=True)

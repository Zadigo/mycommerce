from django.shortcuts import get_object_or_404
from api.utils import get_product_model
from rest_framework.serializers import Serializer, ModelSerializer
from rest_framework import fields

from shop.models import Wishlist

PRODUCT_MODEL = get_product_model()


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
    # original = fields.ImageField()
    # thumbnail = fields.ImageField()
    
    is_main_image = fields.BooleanField()
    
    
class VideoSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField()
    content = fields.FileField()


class ProductSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField(required=False)
    reference = fields.CharField(required=False)
    unit_price = fields.DecimalField(5, 2, required=False)
    
    color = fields.CharField()
    additional_variants = AdditionalVariantSerializer(many=True, required=False)
    images = ImageSerializer(many=True, required=False)
    video = VideoSerializer(required=False)
    
    active = fields.BooleanField(required=False)
    display_new = fields.BooleanField()
    slug = fields.SlugField(required=False)
    modified_on = fields.DateField(required=False)
    created_on = fields.DateField(required=False)


class UserlistSerializer(Serializer):
    id = fields.IntegerField()
    products = ProductSerializer(many=True)
    
    
class WishlistSerializer(UserlistSerializer):
    id = fields.IntegerField()
    name = fields.CharField()
    products = ProductSerializer(many=True)


class ValidateWishList(ModelSerializer):
    class Meta:
        model = Wishlist
        fields = ['name']
            
    def create(self, request, **kwargs):
        data = self.validated_data.copy()
        data['user'] = request.user
        # instance = Wishlist.objects.create(user=request.user, **self.validated_data)
        instance = super().create(data)
        return WishlistSerializer(instance=instance)


class LikeSerializer(UserlistSerializer):
    id = fields.IntegerField()
    products = ProductSerializer(many=True)


class ValidateAddToList(Serializer):
    """Add a product to one of the Like
    or Wishlist model"""
    product = fields.IntegerField()
    wishlist = fields.IntegerField()
    
    def save(self, **kwargs):
        product = get_object_or_404(PRODUCT_MODEL, id=self.validated_data['product'])
        self.instance.products.add(product)
        # wishlist = get_object_or_404(Wishlist, id=self.validated_data['wishlist'])
        # wishlist.products.add(product)



class SimpleProductVariantSerializer(Serializer):
    id = fields.IntegerField()
    reference = fields.CharField()
    color = fields.CharField()
    mark_as_new = fields.BooleanField()
    slug = fields.SlugField()
    modified_on = fields.DateField()
    created_on = fields.DateField()

from django.shortcuts import get_object_or_404
from rest_framework import fields
from rest_framework.serializers import ModelSerializer, Serializer
from variants.serializers import SizeSerializer

from shop.choices import CategoryChoices
from shop.models import Image, Product, Wishlist


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
    sizes = SizeSerializer(many=True)
    # additional_variants = AdditionalVariantSerializer(many=True, required=False)
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


# Dashboard

class DashboardImageSerializer(ModelSerializer):
    mid_size = fields.ImageField()
    
    class Meta:
        model = Image
        fields = ['id', 'name', 'variant', 'mid_size']


class ImageAssociationSerializer(Serializer):
    images = fields.ListField()
    replace_existing_images = fields.BooleanField(default=False)
    
    def get_object(self, produt_id):
        return get_object_or_404(Product, id=produt_id)
    
    def get_images(self):
        return Image.objects.filter(id__in=self.validated_data['images'])
        
    def save(self, product_id, **kwargs):
        product = self.get_object(product_id)
        
        if self.validated_data['replace_existing_images']:
            product.images.set(self.get_images())
        else:
            product.images.add(*self.get_images())
        product.refresh_from_db(fields=['images'])
        return ProductSerializer(instance=product)
        
    def remove(self, product_id, **kwargs):
        product = self.get_object(product_id)
        product.images.remove(*self.get_images())
        product.refresh_from_db(fields=['images'])
        return ProductSerializer(instance=product)


class ProductUpdateValidation(Serializer):
    name = fields.CharField(max_length=100)
    category = fields.ChoiceField(CategoryChoices.choices)
    unit_price = fields.DecimalField(5, 2)
    on_sale = fields.BooleanField(default=False)
    sale_price = fields.DecimalField(5, 2, required=False)
    sale_value = fields.IntegerField(required=False)
    display_new = fields.BooleanField(default=False)
    active = fields.BooleanField(default=False)

    def save(self, **kwargs):
        if self.instance:
            for key, value in self.validated_data.items():
                setattr(self.instance, key, value)
            self.instance.save()

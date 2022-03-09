from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework.serializers import ModelSerializer, Serializer
from shop.models import Image, Product
from rest_framework import fields


class ImageSerializer(ModelSerializer):
    mid_size = fields.ImageField()
    
    class Meta:
        model = Image
        fields = ['id', 'name', 'variant', 'mid_size']


class ProductSerializer(ModelSerializer):    
    class Meta:
        model = Product
        fields = ['id', 'name', 'active']


class ImageAssociationSerializer(Serializer):
    images = fields.ListField()
    
    def save(self, product_id, **kwargs):
        product = get_object_or_404(Product, id=product_id)
        images = Image.objects.filter(id__in=self.validated_data['images'])
        product.images.add(*images)


class RenamProductsValidation(Serializer):
    products = fields.ListField()
    name = fields.CharField(max_length=100, validators=[])
    
    def save(self):
        products = get_list_or_404(Product, id__in=self.validated_data['products'])
        for product in products:
            product.name = self.validated_data['name']
            product.save()
        return products


class ProductUpdateValidation(Serializer):
    name = fields.CharField()
    active = fields.BooleanField(default=False)
    
    def save(self, **kwargs):
        if self.instance:
            for key, value in self.validated_data.items():
                setattr(self.instance, key, value)
            self.instance.save()

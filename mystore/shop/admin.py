import random

from django.contrib import admin
from django.core.exceptions import ValidationError
from django.urls import re_path
from django.urls.resolvers import URLPattern
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import (OpenApiExample, OpenApiParameter,
                                   extend_schema)
from import_export.admin import ImportExportModelAdmin
from import_export.resources import ModelResource

from shop.api.serializers.shop import ProductSerializer
from shop.models import Image, Like, Product, Video, Wishlist
from shop.utils import create_slug
from shop.views import AdminUploadImageView


class ProductResource(ModelResource):
    class Meta:
        model = Product
        # fields = [
        #     'name',
        #     'color',
        #     'sku',
        #     'category',
        #     'unit_price',
        #     'on_sale',
        #     'display_new',
        #     'active',
        #     'slug',
        #     'sale_value',
        #     'display_new'
        # ]


@admin.register(Product)
class ProductAdmin(ImportExportModelAdmin):
    resource_classes = [ProductResource]
    list_display = ['name', 'color', 'category', 'unit_price', 'active']
    filter_horizontal = ['images']
    list_filter = ['active']
    date_hiearchy = 'created_on'
    search_fields = ['name', 'id', 'slug']
    fieldsets = [
        ['General', {'fields': ['name', 'sku']}],
        ['Variant', {'fields': ['color', 'category', 'sub_category']}],
        ['Media', {'fields': ['images', 'video']}],
        ['Pricing', {'fields': ['unit_price',
                                'sale_value', 'sale_price', 'on_sale']}],
        ['Other', {'fields': ['display_new', 'active', 'slug']}]
    ]
    actions = ['activate', 'deactivate', 'download_csv',
               'copy_products', 'create_default_sizes']

    def activate(self, request, queryset):
        queryset.update(active=True)

    def deactivate(self, request, queryset):
        queryset.update(active=False)

    def download_csv(self, request, queryset):
        queryset = None

    def copy_products(self, request, queryset):
        new_products = []
        for product in queryset:
            new_name = f"{product.name}{random.randrange(1, 999)}"
            slug = create_slug(new_name, product.color)
            new_products.append(
                Product(
                    name=new_name,
                    color=product.color,
                    category=product.category,
                    unit_price=product.unit_price,
                    slug=slug
                )
            )
        Product.objects.bulk_create(new_products)

    def create_default_sizes(self, request, queryset):
        """For selected products, create three basic
        sizes XS, S and M which are generally the
        average size for clothes"""
        sizes = ['XS', 'S', 'M']
        for product in queryset:
            for size in sizes:
                try:
                    product.size_set.create(
                        product=product, name=size, availability=False)
                except ValidationError:
                    # If the size already exists for a given
                    # product, just fail silently
                    pass
        self.message_user(
            request, f'Created default sizes for {len(queryset)} products')


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ['name', 'variant', 'created_on', 'is_main_image']
    date_hiearchy = 'created_on'
    search_fields = ['name', 'original']
    list_filter = ['is_main_image']

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            re_path(
                r'^upload-images$',
                AdminUploadImageView.as_view(), None,
                name='admin_upload_images'
            )
        ]
        return urls + custom_urls


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['name', 'content']
    search_fields = ['name']


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'created_on']
    date_hiearchy = 'created_on'


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_on']
    search_fields = ['products__name']
    date_hiearchy = 'created_on'


# class ProductViewset:
#     serializer_class = ProductSerializer

#     def list(self, request):
#         return super().list(request)

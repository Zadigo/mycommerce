from django.contrib import admin

from shop.models import (AdditionalVariant, Image, Like, Product, Video,
                         Wishlist)
import random

from shop.utils import create_product_slug

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'color', 'category', 'unit_price', 'active']
    filter_horizontal = ['images', 'additional_variants']
    list_filter = ['active']
    date_hiearchy = 'created_on'
    search_fields = ['name', 'slug']
    fieldsets = [
        ['General', {'fields': ['name', 'sku']}],
        ['Variant', {'fields': ['color', 'category', 'additional_variants']}],
        ['Media', {'fields': ['images', 'video']}],
        ['Pricing', {'fields': ['unit_price', 'sale_value', 'sale_price', 'on_sale']}],
        ['Other', {'fields': ['display_new', 'active', 'slug']}]
    ]
    actions = ['activate', 'deactivate', 'download_csv', 'copy_products']
    
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
            slug = create_product_slug(new_name, product.color)
            new_products.append(Product(name=new_name, color=product.color, category=product.category, unit_price=product.unit_price, slug=slug))
        Product.objects.bulk_create(new_products)


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ['name', 'original', 'created_on', 'is_main_image']
    date_hiearchy = 'created_on'
    search_fields = ['name', 'original']
    list_filter = ['is_main_image']
    

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['name', 'content']
    search_fields = ['name']


@admin.register(AdditionalVariant)
class AdditionalVariantAdmin(admin.ModelAdmin):
    list_display = ['reference', 'in_stock', 'active']
    list_filter = ['active', 'in_stock']
    

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_on']
    date_hiearchy = 'created_on'


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_on']
    date_hiearchy = 'created_on'

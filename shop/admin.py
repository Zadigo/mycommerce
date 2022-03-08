from django.contrib import admin

from shop.models import AdditionalVariant, Image, Like, Product, Video, Wishlist

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'unit_price', 'active']
    date_hiearchy = 'created_on'
    search_fields = ['name', 'reference']
    actions = ['activate', 'deactivate', 'download_csv']
    
    def activate(self, request, queryset):
        queryset.update(active=True)
    
    def deactivate(self, request, queryset):
        queryset.update(active=False)
        
    def download_csv(self, request, queryset):
        queryset = None


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ['name', 'original', 'is_main_image']
    date_hiearchy = 'created_on'
    search_fields = ['name']
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

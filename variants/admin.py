from django.contrib import admin

from variants.models import Size

@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
    list_display = ['name', 'product', 'sub_category', 'availability']
    list_filter = ['availability', 'active']
    search_fields = ['product__name', 'name']

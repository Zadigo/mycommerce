from django.contrib import admin

from stocks.models import Stock


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ['variant', 'quantity', 'total', 'is_active']
    search_fields = ['variant__product__name']
    

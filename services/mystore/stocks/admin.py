from django.contrib import admin
from stocks.models import Stock, StockAlert


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ['variant', 'quantity', 'total', 'is_active']
    search_fields = ['variant__product__name']


@admin.register(StockAlert)
class StockAlertAdmin(admin.ModelAdmin):
    list_display = ['user', 'variant']
    search_fields = ['user__email', 'variant__product__name']
    date_hierarchy = 'created_on'

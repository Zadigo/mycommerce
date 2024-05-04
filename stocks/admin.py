from django.contrib import admin

from stocks.models import Stock


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ['shortname', 'total_capacity']
    search_fields = ['shortname', 'product__name']

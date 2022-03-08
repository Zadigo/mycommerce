from django.contrib import admin

from orders.models import CustomerOrder, ProductHistory


@admin.register(ProductHistory)
class ProductHistoryAdmin(admin.ModelAdmin):
    list_display = ['product', 'unit_price']
    search_fields = ['product__name']
    date_hiearchy = 'created_on'


@admin.register(CustomerOrder)
class CustomerOrderAdmin(admin.ModelAdmin):
    list_display = ['reference', 'user', 'total']
    search_fields = ['reference', 'products__name']
    date_hiearchy = 'created_on'

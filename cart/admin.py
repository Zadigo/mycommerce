from django.contrib import admin

from cart.models import Cart


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'product', 'price', 'is_anonymous']
    search_fields = ['session_id', 'product__name']
    date_hiearchy = 'created_on'
    list_filter = ['is_anonymous', 'is_paid_for']

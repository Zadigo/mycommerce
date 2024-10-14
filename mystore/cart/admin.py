from django.contrib import admin

from cart.models import Cart


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = [
        'product', 'price',
        'is_stale', 'is_paid_for',
        'is_anonymous'
    ]
    search_fields = ['session_id', 'product__name']
    date_hiearchy = 'created_on'
    list_filter = ['is_anonymous', 'is_paid_for', 'is_stale']
    actions = ['remove_is_paid_for']
    readonly_fields = ['session_id']

    def remove_is_paid_for(self, request, queryset):
        queryset.update(is_paid_for=False)

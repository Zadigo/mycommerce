from django.contrib import admin
from variants.models import Size
from django.contrib import messages


@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
    list_display = ['name', 'product', 'metric', 'active', 'availability']
    list_filter = ['availability', 'active']
    search_fields = ['product__name', 'name']
    fieldsets = [
        [
            None,
            {
                'fields': ['product']
            }
        ],
        [
            'Size',
            {
                'fields': ['name', 'metric']
            }
        ],
        [
            'State',
            {
                'fields': ['availability', 'active']
            }
        ]
    ]
    actions = [
        'make_available', 'make_unavailable', 
        'use_default_metric'
    ]

    def make_available(self, request, queryset):
        queryset.update(availability=True)
        messages.success(request, f'Updated {queryset.count()} products')

    def make_unavailable(self, request, queryset):
        queryset.update(availability=False)
        messages.success(request, f'Updated {queryset.count()} products')

    def use_default_metric(self, request, queryset):
        queryset.update(metric='Clothe')
        messages.success(request, f'Updated {queryset.count()} products')

from django.contrib import admin
from variants.models import Size


@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
    list_display = ['name', 'product', 'metric', 'availability']
    list_filter = ['availability', 'active']
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
    search_fields = ['product__name', 'name']
    actions = ['make_available', 'make_unavailable']

    def make_available(self, request, queryset):
        queryset.update(availability=True)

    def make_unavailable(self, request, queryset):
        queryset.update(availability=False)

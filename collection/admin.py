from django.contrib import admin

from collection.models import Collection


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'created_on']
    search_fields = ['name', 'category', 'products__name', 'sub_category']
    fieldsets = [
        ['Details', {'fields': ['name', 'description', 'illustration']}],
        ['Cateogries', {'fields': ['category', 'sub_category']}],
        ['Products', {'fields': ['products']}],
        ['Other', {'fields': ['tags', 'slug']}]
    ]
    date_hiearchy = 'created_on'
    filter_horizontal = ['products']

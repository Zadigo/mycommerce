from django.contrib import admin

from collection.models import Collection


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'created_on']
    search_fields = ['name', 'category', 'products__name']
    date_hiearchy = 'created_on'
    filter_horizontal = ['products']

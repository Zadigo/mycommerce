from django.contrib import admin

from variants.models import Size

@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
    list_display = ['name', 'sub_category', 'availability']
    list_filter = ['availability']

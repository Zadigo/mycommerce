from django.contrib import admin

class DiscountAdmin(admin.ModelAdmin):
    list_display = ['name', 'start_date', 'end_date']
    date_hierarchy = 'created_on'

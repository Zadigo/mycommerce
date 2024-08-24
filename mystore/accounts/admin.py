from django.contrib import admin

from accounts.models import Address, UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_on', 'has_payment_method']
    date_hierarchy = 'created_on'
    search_fields = ['user__email', 'user__first_name', 'user__last_name']


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = [
        'user_profile', 'address_line',
        'zip_code', 'city', 'is_active'
    ]
    search_fields = ['address_line', 'zip_code', 'country']

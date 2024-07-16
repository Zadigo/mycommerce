from django.contrib import admin

from accounts.models import Address, UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_on']


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['user_profile', 'address_line']

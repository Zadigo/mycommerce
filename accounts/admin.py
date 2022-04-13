from django.contrib import admin

from accounts.models import UserProfile

@admin.register(UserProfile)
class UserAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_on']

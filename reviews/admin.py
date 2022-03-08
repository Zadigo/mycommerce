from django.contrib import admin

from reviews.models import Review, ReviewMedia


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_on']
    search_fields = ['title']
    

@admin.register(ReviewMedia)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['image', 'video']

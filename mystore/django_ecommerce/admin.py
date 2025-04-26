from django.contrib import admin
from django_ecommerce.models import LegalBusiness, SocialNetwork


@admin.register(SocialNetwork)
class SocialNetworkAmin(admin.ModelAdmin):
    list_display = ['version']


@admin.register(LegalBusiness)
class LegalBusinessAdmin(admin.ModelAdmin):
    list_display = ['version', 'legal_name', 'founding_date']
    date_hierarchy = 'created_on'
    fieldsets = [
        [
            'General',
            {
                'fields': ['version', 'legal_name', 'registration_place', 'founding_date']
            }
        ],
        [
            'Company',
            {
                'fields': ['company_type', 'siren', 'siret', 'ape']
            }
        ],
        [
            'Contact',
            {
                'fields': ['general_email', 'customer_service_email', 'telephone', 'address_line', 'locality', 'region', 'postal_code', 'country', 'logo']
            }
        ],
        [
            'Return policies',
            {
                'fields': ['return_fee', 'home_collection_return_fee']
            }
        ]
    ]

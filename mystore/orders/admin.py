from django.contrib import admin
from orders.models import CustomerOrder, ProductHistory


@admin.register(ProductHistory)
class ProductHistoryAdmin(admin.ModelAdmin):
    list_display = ['product', 'unit_price']
    search_fields = ['product__name']
    date_hiearchy = 'created_on'


@admin.register(CustomerOrder)
class CustomerOrderAdmin(admin.ModelAdmin):
    list_display = ['reference', 'user', 'total']
    search_fields = ['reference', 'products__name']
    readonly_fields = ['reference', 'stripe_charge']
    fieldsets = [
        [
            'References',
            {
                'fields': [
                    'reference',
                    'stripe_charge'
                ]
            }
        ],
        [
            'Order',
            {
                'fields': [
                    'total',
                    'products'
                ]
            }
        ],
        [
            'User information',
            {
                'fields': [
                    'user',
                    'address',
                    'city',
                    'zip_code',
                    'country',
                    'notes'
                ]
            }
        ]
    ]
    actions = [
        'send_email_confirmation', 'download_pdf',
        'download_csv', 'send_order_cancelled_email'
    ]
    filter_horizontal = ['products']
    date_hiearchy = 'created_on'

    def send_email_confirmation(self):
        pass

    def download_pdf(self):
        pass

    def download_csv(self):
        pass

    def send_order_cancelled_email(self):
        pass

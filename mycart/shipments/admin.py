from django.contrib import admin

from shipments.models import Shipment


@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ['transporter', 'customer_order', 'created_on']
    date_hierachy = 'created_on'
    search_fields = ['customer_order__products__name']

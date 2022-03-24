from django.db import models

from shipments.choices import TransporterChoices
from shipments.utils import get_orders_model

CUSTOMER_ORDERS_MODEL = get_orders_model()


# class ShippingMethod(models.Model):
#     name = models.CharField(
#         max_length=150,
#         choices=TransporterChoices.choices,
#         default=TransporterChoices.IN_HOUSE
#     )
#     description = models.CharField(max_length=100)
#     cost = models.PositiveIntegerField(default=0)
    
#     is_relais = models.BooleanField(default=False)
#     is_home = models.BooleanField(default=False)
#     is_store = models.BooleanField(default=False)
#     is_inpost = models.BooleanField(default=False)
#     is_cash_on_delivery = models.BooleanField(default=False)
    
#     @property
#     def estimated_delivery_date(self):
#         return ''
    
#     @property
#     def min_delivery_date(self):
#         pass
    
#     @property
#     def max_delivery_date(self):
#         pass


class Shipment(models.Model):
    # shipping_method = models.ForeignKey(
    #   ShippingMethod,
    #   on_delete=models.CASCADE
    # )
    transporter = models.CharField(
        max_length=150,
        choices=TransporterChoices.choices,
        default=TransporterChoices.IN_HOUSE
    )
    tracking_number = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    customer_order = models.ForeignKey(
        CUSTOMER_ORDERS_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )
    delivered = models.BooleanField(default=False)
    created_on = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.transporter

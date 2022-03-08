from django.db import models
from shipments.choices import Transporters

from shipments.utils import get_orders_model

CUSTOMER_ORDERS_MODEL = get_orders_model()

class Shipment(models.Model):
    transporter = models.CharField(
        max_length=150,
        choices=Transporters.choices,
        default=Transporters.IN_HOUSE
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

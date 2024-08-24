from django.db import models
from orders.models import CustomerOrder

from mystore.choices import ShipmentChoices

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
        choices=ShipmentChoices.choices,
        default=ShipmentChoices.CHRONOPOST
    )
    tracking_number = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    customer_order = models.ForeignKey(
        CustomerOrder,
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )
    delivered = models.BooleanField(
        default=False
    )
    created_on = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        indexes = [
            models.Index(
                fields=['delivered'],
                name='not_delivered',
                condition=models.Q(delivered=False)
            )
        ]

    def __str__(self):
        return f'Shipment: {self.transporter}'

    def get_absolute_url(self):
        pass

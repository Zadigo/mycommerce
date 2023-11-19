from uuid import uuid4

from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.forms import ValidationError
from django.utils.functional import cached_property
from django.utils.translation import gettext_lazy as _

from stocks.utils import get_product_model

PRODUCT_MODEL = get_product_model()

class Isle(models.Model):
    """Represents an isle for a given product. An
    isle has dimensions which gives us the amount of
    products stored per shelf"""
    shortname = models.CharField(
        max_length=5,
        validators=[]
    )
    description = models.CharField(
        max_length=200,
        help_text=_('Describe what the isle contains'),
        blank=True,
        null=True
    )    
    total_capacity = models.PositiveIntegerField(default=1)
    created_on = models.DateField(auto_now=True)

    def __str__(self):
        return self.shortname
        

class Stock(models.Model):
    """Represents the current stock
    for the given product or collection"""
    reference = models.UUIDField(default=uuid4)
    product = models.ForeignKey(
        PRODUCT_MODEL,
        on_delete=models.CASCADE
    )
    
    isle = models.OneToOneField(
        Isle,
        help_text=_('The isle on which the product is stored'),
        on_delete=models.CASCADE
    )
    sku = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    quantity = models.PositiveIntegerField(default=20)
    unit_price = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text=_('Unit price of each product')
    )
    total = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text=_('The total value of the stock')
    )
    
    is_active = models.BooleanField(default=True)
    in_stock = models.BooleanField(default=True)
    almost_sold_out = models.BooleanField(default=False)
    
    class Meta:
        indexes = [
            models.Index(fields=['reference'])
        ]    

    def __str__(self):
        return str(self.reference)
    
    def clean(self):
        # We should not be able to add products to
        # isle if it is already full
        if self.quantity > self.isle.total_capacity:
            raise ValidationError('The number of products cannot fit in the isle')
    
    @property
    def used_capacity(self):
        return self.quantity / self.isle.total_capacity
    
    
@receiver(post_save, sender=Stock)
def update_stock(instance, **kwargs):
    instance.total_quantity = instance.isle.total_capacity * instance.unit_price
    # When stock quantity is equals
    # to zero, we are out of stock
    if instance.quantity == 0:
        instance.in_stock = False
    else:
        instance.in_stock = True
    
    # If we have less than 10 products,
    # we are almost out of stock
    if instance.quantity <= 10:
        instance.almost_sold_out = True
    else:
        instance.almost_sold_out = False

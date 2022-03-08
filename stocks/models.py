from django.utils.functional import cached_property
from uuid import uuid4

from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.forms import ValidationError

PRODUCT_MODEL = None

class Isle(models.Model):
    shortname = models.CharField(
        max_length=5,
        validators=[]
    )
    description = models.CharField(
        max_length=200,
        blank=True,
        null=True
    )    
    total_capacity = models.PositiveIntegerField(default=1)
    created_on = models.DateField(auto_now=True)

    def __str__(self):
        return self.shortname
        

class Stock(models.Model):
    reference = models.UUIDField(default=uuid4)
    product = models.ForeignKey(
        PRODUCT_MODEL,
        on_delete=models.CASCADE
    )
    
    isle = models.OneToOneField(
        Isle,
        on_delete=models.CASCADE
    )
    sku = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    quantity = models.PositiveIntegerField(default=20)
    unit_price = models.DecimalField(max_digits=5, decimal_places=2)
    total = models.DecimalField(max_digits=5, decimal_places=2)
    
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
        if self.quantity > self.isle.total_quantity:
            raise ValidationError('The number of products cannot fit in the isle')
    
    @property
    def used_capacity(self):
        return self.quantity / self.isle.total_capacity
    
    
@receiver(post_save, sender=Stock)
def update_stock(instance, **kwargs):
    instance.total_quantity = instance.isle.total_capacity * instance.unit_price
    if instance.quantity == 0:
        instance.in_stock = False
    else:
        instance.in_stock = True
        
    if instance.quantity < 10:
        instance.almost_sold_out = True
    else:
        instance.almost_sold_out = False

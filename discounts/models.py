from django.db import models
from django.utils import timezone
from shop.models import Product
from discounts.validators import validate_percentage
from django.utils.crypto import get_random_string


class Discount(models.Model):
    reference = models.CharField(default=get_random_string(12))
    name = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    products = models.ManyToManyField(
        Product,
        blank=True
    )
    percentage = models.PositiveIntegerField(
        default=0,
        validators=[validate_percentage]
    )
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(default=timezone.now)
    created_on = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return self.reference

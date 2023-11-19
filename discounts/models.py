from django.db import models
from django.utils import timezone
from django.utils.crypto import get_random_string

from discounts.validators import validate_percentage
from shop.models import Product


class Discount(models.Model):
    """References discounts that could be
    applied to a product or a set of given products"""
    reference = models.CharField(
        default=get_random_string(12)
    )
    name = models.CharField(
        max_length=100,
        validators=[],
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

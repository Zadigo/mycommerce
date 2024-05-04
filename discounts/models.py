from django.db import models
from django.utils import timezone
from django.utils.functional import cached_property

from discounts.validators import validate_percentage
from shop.models import Product


class Discount(models.Model):
    """References discounts that could be
    applied to a product or a set of given 
    products from the database"""

    reference = models.CharField(
        max_length=100,
        blank=True,
        null=True
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
    start_date = models.DateField(
        default=timezone.now
    )
    end_date = models.DateField(
        default=timezone.now
    )
    created_on = models.DateField(
        auto_now_add=True
    )

    def __str__(self):
        return f'Discount: {self.reference}'

    @cached_property
    def remaining_days(self):
        """Calculates the remaining days before
        the discount becomes invalid"""
        result = (timezone.now() - self.end_date).days
        return 0 if result < 0 else result

    @property
    def is_valid(self):
        """Checks if the discount is valid by
        comparing if the current date is beyond
        the starting date and below the ending one"""
        return all([
            timezone.now() >= self.start_date,
            self.end_date <= timezone.now()
        ])

from django.contrib.auth import get_user_model
from django.db import models
from django.utils.crypto import get_random_string
from django.utils.translation import gettext_lazy as _

from mycommerce.choices import CityChoices, CountryChoices
from shop.models import Product

USER_MODEL = get_user_model()


class ProductHistory(models.Model):
    """A model that stores a product at the state
    at which it was bought by a customer.
    
    This is useful for when the product's price 
    changes. The price in the order would stay 
    the same as when the customer bought it"""
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True
    )
    unit_price = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )
    created_on = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('product history')
        verbose_name_plural = _('product histories')
        ordering = ['created_on']
    
    def __str__(self):
        return self.product.name


class CustomerOrder(models.Model):
    reference = models.CharField(
        max_length=100,
        default=get_random_string(12),
        unique=True
    )
    stripe_reference = models.CharField(
        max_length=100,
        help_text=_('The stripe order rederence e.g. cus_1234'),
        validators=[],
        unique=True
    )
    user = models.ForeignKey(
        USER_MODEL, 
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    
    address = models.CharField(max_length=100)
    city = models.CharField(
        max_length=100,
        choices=CityChoices.choices,
        default=CityChoices.LILLE
    )
    zip_code = models.CharField(max_length=100)
    country = models.CharField(
        max_length=100,
        choices=CountryChoices.choices,
        default=CountryChoices.FRANCE
    )
    
    products = models.ManyToManyField(ProductHistory, blank=True)
    total = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )
    created_on = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('customer order')
        verbose_name_plural = _('customer orders')
        ordering = ['created_on']

    def __str__(self):
        return self.reference

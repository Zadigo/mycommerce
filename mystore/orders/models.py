from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.utils.translation import gettext_lazy as _
from django_ckeditor_5.fields import CKEditor5Field
from shop.models import Product

from mystore.choices import CityChoices, CountryChoices

USER_MODEL = get_user_model()


class ProductHistory(models.Model):
    """A model that stores a product at the state
    at which it was bought by a given customer.

    This is useful for when the product's price 
    changes. The price in the final order would 
    then stay the same as the initial price"""

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
    created_on = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        verbose_name = _('product history')
        verbose_name_plural = _('product histories')
        ordering = ['created_on']

    def __str__(self):
        return f'Product History: {self.product.name}'


class CustomerOrder(models.Model):
    reference = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        unique=True
    )
    stripe_charge = models.CharField(
        max_length=100,
        help_text=_(
            "The stripe order reference "
            "or charge e.g. ch_1234"
        ),
        validators=[],
        unique=True
    )
    user = models.ForeignKey(
        USER_MODEL,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    address = models.CharField(
        max_length=100
    )
    city = models.CharField(
        max_length=100,
        choices=CityChoices.choices,
        default=CityChoices.LILLE
    )
    zip_code = models.CharField(
        max_length=100
    )
    country = models.CharField(
        max_length=100,
        choices=CountryChoices.choices,
        default=CountryChoices.FRANCE
    )
    products = models.ManyToManyField(
        ProductHistory,
        blank=True,
        help_text=_(
            "Reference to the products that were bought "
            "at the price at which they were bought on "
            "the purchase date"
        )
    )
    total = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )
    notes = CKEditor5Field(
        max_length=5000,
        blank=True,
        null=True
    )
    completed = models.BooleanField(
        default=False,
        help_text=_(
            "Indicates that the order was fully completed: "
            "packaged, shipped and received by the customer"
        )
    )
    refund_requested = models.BooleanField(
        default=False,
        help_text=_(
            "Indicates that the order was cancelled "
            "and refund was requested"
        )
    )
    stock_updated = models.BooleanField(
        default=False,
        help_text=_(
            "Flag that prevents multiple updates of a stock instance "
            "with the same customer order reference"
        )
    )
    created_on = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        verbose_name = _('customer order')
        verbose_name_plural = _('customer orders')
        ordering = ['-created_on']
        indexes = [
            models.Index(
                models.Q(stock_updated=False),
                name='stock_not_updated_index'
            )
        ]

    def __str__(self):
        return f'CustomerOrder: {self.reference}'

    @property
    def return_delay(self):
        return self.created_on + timezone.timedelta(days=15)
    
    @property
    def max_return_delay(self):
        return self.created_on + timezone.timedelta(days=30)


@receiver(pre_save, sender=CustomerOrder)
def create_order_reference(instance, **kwargs):
    if instance.reference is None:
        instance.reference = get_random_string(length=30)

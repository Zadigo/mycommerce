from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.utils.translation import gettext_lazy as _
from django_ckeditor_5.fields import CKEditor5Field

from services.mycart.mycart.choices import CityChoices, CountryChoices


class Product(models.Model):
    """A model that stores very basic information on
    the product that was ordered by the user.

    This is useful for when the product's price
    changes. The price in the final order would
    then stay the same as the initial price."""

    reference = models.IntegerField(
        help_text=_(
            "Active reference to the product in the catalog "
            "and which points to myshop.shop.Product ID field"
        ),
        blank=True,
        null=True
    )
    serialized_data = models.JSONField(
        help_text=_("Serialized product data"),
        default=dict
    )
    unit_price = models.FloatField(
        help_text=_("Price at the time of order"),
        default=0.0
    )
    customer_order = models.ManyToManyField(
        'orders.CustomerOrder',
        blank=True,
        help_text=_("Link to the customer order(s)")
    )
    created_on = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ['created_on']
        indexes = [
            models.Index(
                fields=['reference'],
                name='product_reference_index'
            )
        ]

    def __str__(self):
        return f'{self.reference}'


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
        get_user_model(),
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

    total = models.FloatField(
        default=0.0
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
    return_delay = models.DateTimeField(
        blank=True,
        null=True,
        help_text=_(
            "Date until which the customer can request a return"
        )
    )
    max_return_delay = models.DateTimeField(
        blank=True,
        null=True,
        help_text=_(
            "Maximum date until which the customer can request a return"
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
            ),
            models.Index(
                fields=['reference'],
                name='reference_index'
            ),
            models.Index(
                models.Q(refund_requested=True),
                models.Q(completed=True),
                name='refund_requested_index'
            ),
            models.Index(
                models.Q(completed=True),
                name='completed_index'
            )
        ]

    def __str__(self):
        return f'{self.reference}'


@receiver(pre_save, sender=CustomerOrder)
def create_order_reference(instance, **kwargs):
    if instance.reference is None:
        instance.reference = get_random_string(length=30)


@receiver(post_save, sender=CustomerOrder)
def set_return_dates(instance, created, **kwargs):
    if created and instance.return_delay is None and instance.max_return_delay is None:
        instance.return_delay = instance.created_on + \
            timezone.timedelta(days=15)
        instance.max_return_delay = instance.created_on + \
            timezone.timedelta(days=30)

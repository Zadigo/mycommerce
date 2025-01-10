from django.db import models
from django.db.models import F
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from shop.models import Product


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
    total_capacity = models.PositiveIntegerField(
        default=1
    )
    created_on = models.DateField(
        auto_now=True
    )

    def __str__(self):
        return f'Isle: {self.shortname}'


class Stock(models.Model):
    """Represents the current stock for the given product 
    or collection. This is an independent model that can
    be completed or not by the shop manager but is useful
    for stock management
    """

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )
    # isle = models.OneToOneField(
    #     Isle,
    #     help_text=_('The isle on which the product is stored'),
    #     on_delete=models.CASCADE
    # )
    quantity = models.PositiveIntegerField(
        default=20
    )
    total = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True,
        help_text=_(
            'The total value of the stock'
        )
    )
    is_active = models.BooleanField(
        default=True
    )

    class Meta:
        indexes = [
            models.Index(
                fields=['is_active'],
                condition=models.Q(is_active=True),
                name='active_stocks'
            ),
            models.Index(
                fields=['quantity'],
                condition=models.Q(quantity__gte=10),
                name='high_stock'
            ),
            models.Index(
                fields=['quantity'],
                condition=models.Q(quantity__lte=10),
                name='low_stock'
            )
        ]

    def __str__(self):
        return f'Stock: {self.product}'

    # def clean(self):
    #     # We should not be able to add products to
    #     # isle if it is already full
    #     if self.quantity > self.isle.total_capacity:
    #         raise ValidationError(
    #             'The number of products cannot fit in the isle')

    # @property
    # def used_capacity(self):
    #     return self.quantity / self.isle.total_capacity

    @property
    def in_stock(self):
        """Indicates that a product is
        actively in stock"""
        return any([
            self.quantity != 0,
            self.quantity >= 2
        ])

    @property
    def almost_sold_out(self):
        """Indicates that a product is about
        to be sold out"""
        return self.quantity >= 5 and self.quantity <= 10


@receiver(post_save, sender=Stock)
def update_stock(instance, created, **kwargs):
    if created:
        calculation = F('quantity') * instance.product.unit_price
        # FIXME: Raises error on decimal field
        instance.total = calculation
        # instance.save()

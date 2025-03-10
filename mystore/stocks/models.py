from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import ExpressionWrapper, F
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from variants.models import Size

# class Isle(models.Model):
#     """Represents an isle for a given product. An
#     isle has dimensions which gives us the amount of
#     products stored per shelf"""

#     shortname = models.CharField(
#         max_length=5,
#         validators=[]
#     )
#     description = models.CharField(
#         max_length=200,
#         help_text=_('Describe what the isle contains'),
#         blank=True,
#         null=True
#     )
#     total_capacity = models.PositiveIntegerField(
#         default=1
#     )
#     created_on = models.DateField(
#         auto_now=True
#     )

#     def __str__(self):
#         return f'Isle: {self.shortname}'


# TODO: In definitive update link this model to a Variant
# model in shop.Variant and which removes the "variant" app.
# The end goal is to normalize variants into one single model
# so that we can have a single flag "active" which can be activated
# on combination of variants ex. S.active, (S + Petite).active

class Stock(models.Model):
    """Represents the current stock for the given product 
    or collection. This is an independent model that can
    be completed or not by the shop manager but is useful
    for stock management
    """

    variant = models.ForeignKey(
        Size,
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )

    # TODO: Allow the user to link stocks to a
    # specific product variant

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
        return f'Stock: {self.variant}'

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


class StockAlert(models.Model):
    """Model used to keep track of users who have
    requested to alerted when a product that is not
    in stock is back in avaialable"""

    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE
    )
    variant = models.ForeignKey(
        Size,
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )
    alert_sent = models.BooleanField(
        default=False
    )
    created_on = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f'{self.user}: {self.variant}'


@receiver(post_save, sender=Stock)
def update_stock_total(instance, created, **kwargs):
    if created:
        calculation = F('quantity') * instance.variant.product.unit_price
        expression = ExpressionWrapper(
            calculation,
            output_field=models.DecimalField(max_digits=5, decimal_places=2)
        )
        instance.total = expression
        instance.save()

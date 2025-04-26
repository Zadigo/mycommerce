from django.db import models
from django.db.models.constraints import UniqueConstraint
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from shop import validators
from shop.models import Product
from variants.choices import VariantMetrics

# TODO: Consider moving this models to the shop
# app if we want to consider doing something
# like how Bershka does: https://www.bershka.com/fr/pantalon-lin-taille-%C3%A9lastique-c0p175233285.html?colorId=800
# and unify the variants into a single model
# especially for stock management


class AbstractVariant(models.Model):
    """Model which allows us to track variant 
    availability independently from the global 
    state"""

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )
    attributed_price = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=1,
        help_text=_(
            "Price attributed specifically to "
            "this product variant"
        ),
        validators=[validators.price_validator]
    )
    availability = models.BooleanField(
        default=True
    )
    active = models.BooleanField(
        default=True
    )

    class Meta:
        abstract = True


class Size(AbstractVariant):
    """Model used to store data on the different
    available sizes for a product. This model
    allows us to also track size availability
    or active state independently from from
    the main product state"""

    name = models.CharField(
        max_length=100,
        help_text=_("The name of the size to use")
    )
    metric = models.CharField(
        max_length=100,
        help_text=_('The specific metric to use for the size value'),
        choices=VariantMetrics.choices,
        default=VariantMetrics.CLOTHE
    )

    class Meta:
        verbose_name = _('Size')
        verbose_name_plural = _('Sizes')
        constraints = [
            UniqueConstraint(
                fields=['product', 'name'],
                name='unique_size_per_product'
            )
        ]

    def __str__(self):
        return f'{self.product.name}: {self.name}'


@receiver(pre_save, sender=Size)
def transform_size(instance, **kwargs):
    """Signal that attempts to normalize the input
    size for the database and Nuxt"""
    if instance.name:
        capitalize = ['Bra', 'Clothe']
        if instance.metric in capitalize:
            instance.name = str(instance.name).upper()
        
        if instance.metric == 'Text':
            instance.name = str(instance.name).lower().title()

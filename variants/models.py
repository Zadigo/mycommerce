from django.db import models
from django.db.models.constraints import UniqueConstraint
from django.utils.translation import gettext_lazy as _
from shop.models import Product

from variants.choices import ClotheSizesChoices, VariantSubcategoryChoices


class Size(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )
    name = models.CharField(
        max_length=100,
        choices=ClotheSizesChoices.choices(),
        default=ClotheSizesChoices.default('S')
    )
    sub_category = models.CharField(
        max_length=100,
        choices=VariantSubcategoryChoices.choices,
        default=VariantSubcategoryChoices.CLOTHE_SIZE
    )
    availability = models.BooleanField(default=True)
    active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = _('Size')
        verbose_name_plural = _('Sizes')
        constraints = [
            UniqueConstraint(fields=['product', 'name'], name='unique_size_per_product')
        ]
    
    def __str__(self):
        return self.product.name

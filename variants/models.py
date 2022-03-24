from django.db import models
from shop.models import Product
from variants.choices import ClotheSizesChoices

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
    availability = models.BooleanField(
        default=True
    )

    def __str__(self):
        return self.product

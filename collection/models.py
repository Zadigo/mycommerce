from django.db import models
from shop.models import Product

from collection.choices import CollectionCategories


class Collection(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True
    )
    category = models.CharField(
        max_length=100,
        choices=CollectionCategories.choices,
        default=CollectionCategories.SKIRTS
    )
    description = models.TextField(
        max_length=500,
        blank=True,
        null=True
    )
    products = models.ManyToManyField(
        Product,
        blank=True
    )
    illustration = models.ImageField(blank=True, null=True)
    tags = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    slug = models.SlugField()
    created_on = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    @property
    def get_view_name(self):
        return self.name.lower()

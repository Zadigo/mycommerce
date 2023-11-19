from django.db import models
from django.db.models import UniqueConstraint
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.urls import reverse
from django.utils.text import get_valid_filename
from django.utils.translation import gettext_lazy as _
from imagekit import processors
from imagekit.models import ImageSpecField
from django.utils.functional import cached_property
from collection.choices import CategoryChoices, SubCategoryChoices
from collection.utils import create_slug
from shop.models import Product


class Collection(models.Model):
    """Represents a collection of products"""
    name = models.CharField(
        max_length=100
    )
    category = models.CharField(
        max_length=100,
        help_text=_('Global collection category'),
        choices=CategoryChoices.choices,
        default=CategoryChoices.SHORTS
    )
    sub_category = models.CharField(
        max_length=100,
        choices=SubCategoryChoices.choices(),
        default=SubCategoryChoices.default('Not attributed')
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
    illustration = models.ImageField(
        help_text=_('Image should be 1200 x 800'),
        blank=True,
        null=True
    )
    tags = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    # active = models.BooleanField(default=True)
    slug = models.SlugField(blank=True)
    created_on = models.DateField(auto_now_add=True)

    class Meta:
        constraints = [
            UniqueConstraint(
                fields=['name', 'category'],
                name='unique_name_per_category'
            )
        ]

    def __str__(self):
        return self.name

    @property
    def get_view_name(self):
        return self.name.lower()

    @property
    def get_sub_category_name(self):
        return create_slug(self.sub_category)

    @cached_property
    def number_of_items(self):
        return self.products.count()

    def get_absolute_url(self):
        return reverse('collection:detail', kwargs={
            'slug': self.slug,
            'sub_category': self.get_sub_category_name
        })


@receiver(pre_save, sender=Collection)
def create_collection_slug(instance, **kwargs):
    instance.slug = create_slug(instance.name)

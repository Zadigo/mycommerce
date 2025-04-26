from collection.utils import create_slug
from django.db import models
from django.db.models import UniqueConstraint
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.urls import reverse
from django.utils.functional import cached_property
from django.utils.translation import gettext_lazy as _
from shop.models import Product

from mystore.choices import CategoryChoices, SubCategoryChoices


class Collection(models.Model):
    """This model allows us to regroup certain
    products under a specific given collection
    that can then be accessed under said collection
    name by the user in the frontend"""

    name = models.CharField(
        max_length=100,
        help_text=_("User friendly custom name for the collection")
    )
    category = models.CharField(
        max_length=100,
        help_text=_('Global category for the given collection'),
        choices=CategoryChoices.choices,
        default=CategoryChoices.SHORTS
    )
    sub_category = models.CharField(
        max_length=100,
        help_text=_('Specific detailled category for the given collection'),
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
        help_text=_('Image size should be 1200x800'),
        blank=True,
        null=True
    )
    tags = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    # active = models.BooleanField(default=True)
    slug = models.SlugField(
        blank=True
    )
    subcategory_slug = models.SlugField(
        blank=True
    )
    created_on = models.DateField(
        auto_now_add=True
    )

    class Meta:
        constraints = [
            UniqueConstraint(
                fields=['name', 'category'],
                name='unique_name_per_category'
            )
        ]

    def __str__(self):
        return f'Collection: {self.name}'

    @property
    def get_view_name(self):
        return self.name.lower()

    @cached_property
    def number_of_items(self):
        return self.products.count()

    def save(self, **kwargs):
        super().save(**kwargs)

        # To avoid different values on the
        # product category and collection category,
        # save the collection category value also on
        # the product -; this allows consistency between
        # both models especially when running queries
        qs = self.products.all()
        if qs.exists():
            qs.update(category=self.category)


@receiver(pre_save, sender=Collection)
def create_collection_slug(instance, **kwargs):
    instance.slug = create_slug(instance.name)
    instance.subcategory_slug = create_slug(instance.subcategory_slug)

import pathlib
import random
import string

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import CheckConstraint, Choices, Q, UniqueConstraint
from django.db.models.signals import post_delete, pre_delete, pre_save
from django.dispatch import receiver
from django.forms import ValidationError
from django.urls import reverse
from django.utils.timezone import now, timedelta
from django.utils.translation import gettext_lazy as _
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill
from shop import validators
from shop.choices import ColorChoices
from shop.utils import calculate_sale, create_slug, image_path, video_path

from mystore.choices import CategoryChoices, SubCategoryChoices

USER_MODEL = get_user_model()


class Image(models.Model):
    """The `Image` model represents image content associated 
    with products in the e-commerce application. It stores 
    image files and their metadata, such as the name, variant, 
    and creation date. This model also handles image processing 
    to generate different sizes and formats for display purposes
    """

    name = models.CharField(
        max_length=100,
        unique=True,
        help_text=_(
            "Used for the image's "
            "alt attribute"
        )
    )
    variant = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    original = models.ImageField(
        upload_to=image_path
    )
    mid_size = ImageSpecField(
        source='original',
        format='JPEG',
        options={'quality': 90},
        processors=[ResizeToFill(689, 1100)]
    )
    thumbnail = ImageSpecField(
        source='original',
        format='JPEG',
        options={'quality': 70},
        processors=[ResizeToFill(200, 200)]
    )
    is_main_image = models.BooleanField(
        default=False
    )
    created_on = models.DateField(
        auto_now_add=True
    )

    class Meta:
        ordering = ['-created_on', 'name']
        indexes = [
            models.Index(
                condition=Q(is_main_image=True),
                fields=['is_main_image'],
                name='main_image_images'
            )
        ]

    def __str__(self):
        if self.variant is not None:
            return self.name_with_variant
        return self.name

    @property
    def name_with_variant(self):
        return f'{self.name} - {self.variant}'


class Video(models.Model):
    """The `Video` model represents video content related 
    to products in the e-commerce application. It stores 
    video files and their metadata, such as the name and 
    creation date. This model helps in providing a rich 
    multimedia experience for product listings"""

    name = models.CharField(
        max_length=100,
        unique=True,
        help_text=_('Used for the video alt attribute')
    )
    content = models.FileField(
        upload_to=video_path,
        validators=[validators.validate_video_file_extension]
    )
    created_on = models.DateField(auto_now=True)

    def __str__(self):
        return self.name


class AbstractProduct(models.Model):
    name = models.CharField(
        max_length=100
    )
    color = models.CharField(
        max_length=100,
        choices=ColorChoices.choices,
        default=ColorChoices.BLACK,
        help_text=_('Product available colors')
    )
    sku = models.CharField(
        max_length=100,
        verbose_name='SKU',
        help_text=_('Stock Keeping Unit'),
        unique=True,
        blank=True,
        null=True
    )
    model_height = models.CharField(
        max_length=100,
        validators=[validators.validate_model_height],
        help_text=_(
            "Indicates the height of the model wearing "
            "the piece of clothing"
        ),
        blank=True,
        null=True
    )
    model_size = models.CharField(
        max_length=100,
        help_text=_(
            "Indicates the size of the clothe "
            "weared by the model"
        ),
        blank=True,
        null=True
    )
    # section_name = None # Woman, Man...
    # category_en = None
    category = models.CharField(
        max_length=100,
        choices=CategoryChoices.choices,
        default=CategoryChoices.NOT_ATTRIBUTED,
        help_text=_(
            "The main category under which the product "
            "can be grouped. This allows the grouping of "
            "products that fit under the given category"
        )
    )
    # sub_category_en = None
    sub_category = models.CharField(
        max_length=100,
        verbose_name=_('Sub-category'),
        choices=SubCategoryChoices.choices(),
        default=SubCategoryChoices.default('Not attributed'),
        help_text=_(
            "Additionnal category that can be used to "
            "better classify the product in the database"
        )
    )
    images = models.ManyToManyField(
        Image,
        blank=True
    )
    video = models.ForeignKey(
        Video,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    unit_price = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=1,
        help_text=_('Cost value of the current product'),
        validators=[validators.price_validator]
    )
    sale_value = models.PositiveIntegerField(
        default=0,
        help_text=_('The current sale value for the product')
    )
    sale_price = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )
    on_sale = models.BooleanField(
        default=False
    )
    display_new = models.BooleanField(
        default=False,
        help_text=_('Show the product as new')
    )
    slug = models.SlugField(
        max_length=200,
        unique=True,
        blank=True
    )
    active = models.BooleanField(
        default=False
    )
    modified_on = models.DateField(
        auto_now_add=True
    )
    created_on = models.DateField(
        auto_now=True
    )

    class Meta:
        abstract = True
        ordering = ['-created_on']
        indexes = [
            models.Index(
                condition=Q(on_sale=True),
                fields=['on_sale'],
                name='on_sale_products'
            ),
            models.Index(
                condition=Q(display_new=True),
                fields=['display_new'],
                name='display_new_products'
            ),
            models.Index(
                condition=Q(active=True),
                fields=['active'],
                name='active_products'
            )
        ]
        constraints = [
            # UniqueConstraint(
            #     fields=['name', 'color', 'sku'],
            #     name='unique_name_with_color'
            # ),
            CheckConstraint(
                check=Q(unit_price__gt=0),
                name='unit_price_over_zero'
            )
        ]

    def __str__(self):
        return f'{self.pk}: {self.name}'

    @property
    def is_new(self):
        """The `is_new` property is a read-only attribute 
        that determines whether a product is considered new. 
        A product is classified as new if it has been created 
        within the last five days."""
        difference = (now() - timedelta(days=5))
        return self.created_on <= difference.date()

    @property
    def get_main_image(self):
        """The `get_main_image` property is a read-only attribute 
        that retrieves the main image for a product. If the product 
        has a designated main image, it returns that image; otherwise, 
        it returns the first image from the product's image collection."""
        queryset = self.images.filter(is_main_image=True)
        if queryset.exists():
            return queryset.first()
        return self.images.first()

    @property
    def has_multiple_images(self):
        return self.images.all().count() > 1

    @property
    def get_price(self):
        """The `get_price` property is a read-only attribute 
        that determines and returns the appropriate price for 
        a product. It simplifies the logic for price display on 
        Nuxt by checking if the product is on sale and 
        returning the sale price if applicable, otherwise the regular 
        unit price"""
        if self.on_sale and self.sale_price > 0:
            return self.sale_price
        return self.unit_price

    @property
    def vat_price(self):
        """Property that returns the product price (using get_price)
         + VAT from settings.VAT_PERCENTAGE"""
        if settings.VAT_PERCENTAGE is not None:
            percentage = 1 + (settings.VAT_PERCENTAGE / 100)
            return self.get_price * percentage
        return None

    @property
    def usd_unit_price(self):
        """Converts the current price
        from EUR to USD"""
        price = float(self.get_price)
        return price * 1.02

    @property
    def sizes(self):
        """Returns all the available
        sizes for the given product"""
        return self.size_set.all()

    @property
    def has_sizes(self):
        """Checks if there are available
        sizes for the given product"""
        return self.sizes.exists()

    @property
    def product_collection(self):
        """Get the first collection in which the
        active product was classified in"""
        return self.collection_set.first()

    @property
    def color_variant_name(self):
        return f'{self.name} {self.color}'

    def clean(self):
        if self.on_sale:
            if self.sale_value == 0:
                raise ValidationError(
                    {
                        'sale_value': _("A product on sale cannot have a sale value of 0")
                    }
                )
            self.sale_price = calculate_sale(self.unit_price, self.sale_value)

        if not self.sku:
            color = self.color[:3]
            numbers = map(lambda _: random.choice(string.digits), range(10))
            self.sku = f"{color.upper()}{''.join(numbers)}"

    def get_absolute_url(self):
        return reverse('shop:product', kwargs={
            'slug': self.slug
        })


class Product(AbstractProduct):
    """The Product model, inheriting from the `AbstractProduct` 
    class, represents fashion items in the e-commerce application. 
    It encompasses various attributes and methods essential for 
    product management, ensuring a comprehensive representation of 
    each product's details and functionalities"""

    class Meta(AbstractProduct.Meta):
        verbose_name = _('Product')
        verbose_name_plural = _('Products')


# class ViewingHistory(models.Model):
#     """Saves the the viewing history
#     of the products that are saved in
#     the database"""

#     product = models.ForeignKey(
#         Product,
#         models.CASCADE
#     )
#     created_on = models.DateTimeField(
#         auto_now=True
#     )

#     def __str__(self):
#         return f'ViewingHistory: {self.product.name}'


class AbstractUserList(models.Model):
    """Base abstract model for lists that were
    created or automatically created for the user"""

    products = models.ManyToManyField(
        Product,
        blank=True
    )
    user = models.ForeignKey(
        USER_MODEL,
        on_delete=models.CASCADE
    )
    created_on = models.DateField(auto_now=True)

    class Meta:
        abstract = True

    def __str__(self):
        return str(self.user)

# TODO: Remove this model which redundant
# with the wishlist


class Like(AbstractUserList):
    """Stores products that were liked
    by the user and added to a specific
    liked products list"""

    class Meta:
        verbose_name = _('Like')
        constraints = [
            UniqueConstraint(fields=['user'], name='one_list_per_user')
        ]


class Wishlist(AbstractUserList):
    """The `Wishlist` model represents a collection of 
    products that a user has added to their wishlist. 
    This feature allows users to save products they are 
    interested in, facilitating easy access for future purchases. 
    Wishlists enhance the shopping experience by helping users 
    organize and keep track of their desired items"""

    name = models.CharField(
        max_length=100
    )

    class Meta:
        verbose_name = _('Wishlist')
        constraints = [
            UniqueConstraint(
                fields=['name', 'user'],
                name='unique_list_name_per_user'
            )
        ]


@receiver(pre_save, sender=Product)
def create_product_slug(instance, **kwargs):
    color = instance.color
    if isinstance(color, Choices):
        color = color.label
    instance.slug = create_slug(instance.name, color)


@receiver(post_delete, sender=Image)
def delete_image(sender, instance, **kwargs):
    is_s3_backend = getattr(settings, 'USE_S3', False)
    if not is_s3_backend:
        if instance.original:
            path = pathlib.Path(instance.original.path)
            if path.is_file():
                path.unlink()
    else:
        instance.url.delete(save=False)


@receiver(pre_save, sender=Image)
def delete_image_on_update(sender, instance, **kwargs):
    is_s3_backend = getattr(settings, 'USE_S3', False)
    if not is_s3_backend:
        if instance.pk:
            try:
                old_image = Image.objects.get(pk=instance.pk)
            except:
                return
            else:
                new_image = instance.original
                if old_image and old_image != new_image:
                    path = pathlib.Path(old_image.original.path)
                    if path.is_file():
                        path.unlink()
    else:
        instance.original.delete(save=False)


# OPTIONAL: Signal that can be used to clean up the
# picture assets when a product is deleted

@receiver(pre_delete, sender=Product)
def delete_images(sender, instance, **kwargs):
    """Signal that delets all the images related to the
    given product when it is deleted from the database"""
    is_s3_backend = getattr(settings, 'USE_S3', False)
    images = instance.images.all()
    for image in images:
        if image.original:
            if not is_s3_backend:
                path = pathlib.Path(image.original.path)
                if path.is_file():
                    path.unlink()
            else:
                image.original.delete(save=False)

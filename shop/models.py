import pathlib
import random
import string

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import CheckConstraint, Choices, Q, UniqueConstraint
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from django.forms import ValidationError
from django.urls import reverse
from django.utils.timezone import now, timedelta
from django.utils.translation import gettext_lazy as _
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill

from mycommerce.choices import SubCategoryChoices
from shop.choices import ColorChoices
from shop.utils import calculate_sale, create_slug, image_path, video_path
from shop.validators import price_validator, validate_video_file_extension

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
        help_text=_("Used for the image's alt attribute")
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
        return self.name


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
        validators=[validate_video_file_extension]
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
        help_text=_('Stock Keeping Unit'),
        unique=True,
        blank=True,
        null=True
    )
    category = models.CharField(
        max_length=100,
        choices=SubCategoryChoices.choices(),
        default=SubCategoryChoices.default('Not attributed'),
        help_text=_("The product's main category")
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
        help_text=_('Cost value of the product'),
        validators=[price_validator]
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
        ordering = ['name', '-created_on']
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
            UniqueConstraint(
                fields=['name', 'color'],
                name='unique_name_with_color'
            ),
            CheckConstraint(
                check=Q(unit_price__gt=0),
                name='unit_price_over_zero'
            )
        ]

    def __str__(self):
        return f'Product - {self.pk}: {self.name}'

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
        the frontend by checking if the product is on sale and 
        returning the sale price if applicable, otherwise returning 
        the regular unit price"""
        if self.on_sale and self.sale_price > 0:
            return self.sale_price
        return self.unit_price

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

    name = models.CharField(max_length=100)

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
                return False
            else:
                new_image = instance.original
                # FIXME: This does not work. When trying to save the
                # model, the image gets deleted e.g. when trying to
                # set the new is_main_image
                # if old_image and old_image != new_image:
                #     path = pathlib.Path(old_image.original.path)
                #     if path.is_file():
                #         path.unlink()
    else:
        instance.original.delete(save=False)


# @receiver(pre_delete, sender=Product)
def delete_images(sender, instance, **kwargs):
    images = instance.images.all()
    for image in images:
        if image.url:
            path = pathlib.Path(image.url.path)
            if path.is_file():
                path.unlink()
            # if os.path.isfile(image.original.path):
            #     os.remove(image.url.path)

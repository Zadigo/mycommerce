import os

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import UniqueConstraint
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from django.forms import ValidationError
from django.utils.crypto import get_random_string
from django.utils.translation import gettext_lazy as _
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill

from shop.choices import (CategoryChoices, ColorChoices, VariantChoices,
                          VariantSubcategoryChoices)
from shop.utils import (calculate_sale, create_product_slug, image_path,
                        video_path)
from shop.validators import price_validator, validate_video_file_extension

USER_MODEL = get_user_model()


class Image(models.Model):
    """Images showcasing the product"""
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
    original = models.ImageField(upload_to=image_path)
    mid_size = ImageSpecField(
        source='original',
        format='JPEG',
        options={'quality': 90},
        processors = [ResizeToFill(689, 1100)]
    )
    thumbnail = ImageSpecField(
        source='original',
        format='JPEG',
        options={'quality': 70},
        processors=[ResizeToFill(200, 200)]
    )
    is_main_image = models.BooleanField(default=False)
    created_on = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ['-created_on', 'name']
        indexes = [
            models.Index(fields=['original'])
        ]
        
    def __str__(self):
        return self.name
    
    
class Video(models.Model):
    """Video showcasing the product"""
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
    
    
class AdditionalVariant(models.Model):
    """Variants for size..."""
    reference = models.CharField(
        max_length=100,
        default=get_random_string(12),
        unique=True
    )
    category = models.CharField(
        max_length=100,
        choices=VariantChoices.choices,
        default=VariantChoices.SIZE
    )
    sub_category = models.CharField(
        max_length=100,
        choices=VariantSubcategoryChoices.choices,
        default=VariantSubcategoryChoices.NOT_ATTRIBUTED
    )
    name = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    
    in_stock = models.BooleanField(default=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.pk}"
    
    
class AbstractProduct(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(
        max_length=100,
        choices=ColorChoices.choices,
        default=ColorChoices.BLACK,
        help_text=_('Defines a declination of a main product in color')
    )
    sku = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        validators=[]
    )
    
    additional_variants = models.ManyToManyField(
        AdditionalVariant, 
        blank=True,
        help_text=_('Declination in size, patterns...')
    )
    category = models.CharField(
        max_length=100,
        choices=CategoryChoices.choices,
        default=CategoryChoices.SHORTS
    )
    images = models.ManyToManyField(Image, blank=True)
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
    
    sale_value = models.PositiveIntegerField(default=0)
    sale_price = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )
    on_sale = models.BooleanField(default=False)
    
    display_new = models.BooleanField(
        default=False,
        help_text=_('Explicitly mark a product as being new')
    )
    slug = models.SlugField(max_length=100, unique=True)
    active = models.BooleanField(default=False)
    
    modified_on = models.DateField(auto_now_add=True)
    created_on = models.DateField(auto_now=True)
    
    class Meta:
        abstract = True
        ordering = ['name', '-created_on']
        indexes = [
            models.Index(fields=['name', 'sku', 'category'])
        ]
        constraints = [
            UniqueConstraint(fields=['name', 'color'], name='unique_name_with_color')
        ]
        
    def __str__(self):
        return self.name
        
    @property
    def get_main_image(self):
        queryset = self.images.filter(is_main_image=True)
        if queryset.exists():
            return queryset.first()
        return self.images.first()

    @property
    def get_price(self):
        if self.on_sale and self.sale_price > 0:
            return self.sale_price
        return self.unit_price
    
    def clean(self):
        if self.on_sale:
            if self.sale_value == 0:
                raise ValidationError({'sale_value': _("A product on sale cannot have a sale value of 0")})
            self.sale_price = calculate_sale(self.unit_price, self.sale_value)
        

class Product(AbstractProduct):    
    class Meta(AbstractProduct.Meta):
        verbose_name = _('Product')
        verbose_name_plural = _('Produits')
    

class AbstractUserList(models.Model):
    """Base model for user lists"""
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


class Like(AbstractUserList):
    """Products liked"""
    class Meta:
        constraints = [
            UniqueConstraint(fields=['user'], name='one_list_per_user')
        ]
        
    
class Wishlist(AbstractUserList):
    """User's wishlists of products"""
    name = models.CharField(max_length=100)
    
    class Meta:
        constraints = [
            UniqueConstraint(fields=['name', 'user'], name='unique_list_name_per_user')
        ]


@receiver(pre_save, sender=Product)
def create_slug(instance, **kwargs):
    instance.slug = create_product_slug(instance.name, instance.color)


@receiver(post_delete, sender=Image)
def delete_image(sender, instance, **kwargs):
    # is_s3_backend = False
    # try:
    #     is_s3_backend = settings.USE_S3
    # except:
    #     pass
    is_s3_backend = getattr(settings, 'USE_S3', False)
    if not is_s3_backend:
        if instance.original:
            if os.path.isfile(instance.original.path):
                os.remove(instance.original.path)
    else:
        instance.url.delete(save=False)
        

@receiver(pre_save, sender=Image)
def delete_image_on_update(sender, instance, **kwargs):
    # is_s3_backend = False
    # try:
    #     is_s3_backend = settings.USE_S3
    # except:
    #     pass
    is_s3_backend = getattr(settings, 'USE_S3', False)
    if not is_s3_backend:
        if instance.pk:
            try:
                old_image = Image.objects.get(pk=instance.pk)
            except:
                return False
            else:
                new_image = instance.original
                if old_image and old_image != new_image:
                    if os.path.isfile(old_image.original.path):
                        os.remove(old_image.original.path)
    else:
        instance.original.delete(save=False)


# @receiver(pre_delete, sender=Product)
def delete_images(sender, instance, **kwargs):
    images = instance.images.all()
    for image in images:
        if image.url:
            if os.path.isfile(image.original.path):
                os.remove(image.url.path)

from django.contrib.auth import get_user_model
from django.db import models
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill
from orders.models import CustomerOrder
from reviews.utils import review_media_path
from shop.models import Product

from reviews.validators import validate_rating, validate_video

USER_MODEL = get_user_model()


class ReviewMedia(models.Model):
    image = ProcessedImageField(
        upload_to=review_media_path,
        format='JPEG',
        options={'quality': 80},
        processors=[ResizeToFill(800, 800)],
        blank=True,
        null=True
    )
    video = models.FileField(
        upload_to=review_media_path,
        validators=[validate_video],
        blank=True,
        null=True
    )
    created_on = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return self.created_on


class Review(models.Model):
    user = models.ForeignKey(
        USER_MODEL,
        on_delete=models.CASCADE
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )
    media = models.ManyToManyField(
        ReviewMedia,
        blank=True
    )
    rating = models.PositiveIntegerField(
        default=1,
        validators=[validate_rating]
    )
    title = models.CharField(max_length=200)
    comment = models.TextField(
        max_length=5000
    )
    created_on = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_on', '-id']
    
    def __str__(self):
        return self.title

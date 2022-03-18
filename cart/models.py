from django.contrib.auth import get_user_model
from django.db import models
from shop.choices import ClotheSizesChoices
from django.utils.translation import gettext_lazy as _
from cart.managers import CartManager
from shop.models import Product


USER_MODEL = get_user_model()

class AbstractCart(models.Model):
    session_id = models.CharField(
        max_length=100,
        help_text=_("Unique identifier used essentially for anonymous user carts")
    )
    user = models.ForeignKey(
        USER_MODEL,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )
    default_size = models.CharField(
        max_length=100,
        choices=ClotheSizesChoices.choices(),
        default=ClotheSizesChoices.default('Unique')
    )
    price = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    is_anonymous = models.BooleanField(default=False)
    is_paid_for = models.BooleanField(default=False)

    created_on = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['-created_on', '-pk']
        indexes = [
            models.Index(fields=['price', 'session_id']),
        ]

    def __str__(self):
        return self.session_id


class Cart(AbstractCart):
    objects = CartManager.as_manager()

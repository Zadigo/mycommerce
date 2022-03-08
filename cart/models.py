from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models

from cart.managers import CartManager
from cart.utils import calculate_vat, get_product_model
from cart.validators import validate_quantity

PRODUCT_MODEL = get_product_model()

USER_MODEL = get_user_model()

class AbstractCart(models.Model):
    session_id = models.CharField(
        max_length=100,
        help_text="Unique item to identify each products within a user's cart"
    )
    user = models.ForeignKey(
        USER_MODEL,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    product = models.ForeignKey(
        PRODUCT_MODEL,
        on_delete=models.CASCADE
    )

    quantity = models.PositiveIntegerField(
        default=1,
        validators=[validate_quantity]
    )
    price_pre_tax = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )
    price_post_tax = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )
    total = models.DecimalField(
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
            models.Index(fields=['price_pre_tax', 'session_id']),
        ]

    def __str__(self):
        return self.session_id
    
    # @property
    # def price_has_changed(self):
    #     return self.product.unit_price != self.price_pre_tax

    def clean(self):
        self.price_post_tax = calculate_vat(self.product.unit_price)
        
        # Determines whether the VAT'ed price should
        # be use in the calculation for the total.
        # This is useful for enterprises that are not
        # required to use VAT e.g. autoentrepreneur
        use_vat = getattr(settings, 'USE_VAT', True)
        # price = self.price_pre_tax
        price = self.product.unit_price
        if use_vat:
            price = self.price_post_tax
        self.total = price * self.quantity
        

class Cart(AbstractCart):
    objects = CartManager.as_manager()

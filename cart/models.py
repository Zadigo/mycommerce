from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import Q
from django.utils.translation import gettext_lazy as _

from cart.managers import CartManager
from discounts.utils import calculate_discount
from shop.choices import ClotheSizesChoices
from shop.models import Product

USER_MODEL = get_user_model()


class AbstractCart(models.Model):
    session_id = models.CharField(
        max_length=100,
        help_text=_(
            "Unique session identifier "
            "for the user's carts"
        )
    )
    user = models.ForeignKey(
        USER_MODEL,
        on_delete=models.CASCADE,
        help_text=_('Identifies a logged in user'),
        blank=True,
        null=True
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )
    size = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        choices=ClotheSizesChoices.choices(),
        default=ClotheSizesChoices.default('Unique')
    )
    price = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )
    # has_discount = models.BooleanField(
    #     default=False
    # )
    is_stale = models.BooleanField(
        default=False,
        help_text=_(
            "Previous products from an authenticated user on which "
            "no actions were performed"
        )
    )
    is_anonymous = models.BooleanField(
        default=False
    )
    is_paid_for = models.BooleanField(
        default=False
    )
    created_on = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        abstract = True
        ordering = ['-created_on', '-pk']
        indexes = [
            models.Index(fields=['price', 'session_id']),
        ]

    def __str__(self):
        return f'Session: {self.session_id}'

    # def discounted_prices(self):
    #     """If the the current product is related to
    #     a discount tag, return the list of all the
    #     discounts available to this product"""
    #     results = []
    #     discounts = self.product.discount_set.all()
    #     for discount in discounts:
    #         results.append({
    #             'name': discount.name,
    #             'discounted_price': calculate_discount(
    #                 self.product.name,
    #                 discount.discount_percentage
    #             )
    #         })
    #     return results


class Cart(AbstractCart):
    objects = CartManager.as_manager()

    class Meta(AbstractCart.Meta):
        verbose_name = _('Cart')
        verbose_name_plural = _('Carts')
        indexes = [
            models.Index(
                condition=Q(is_paid_for=True),
                fields=['is_paid_for'],
                name='is_paid_for_carts'
            )
        ]
        constraints = [
            models.CheckConstraint(
                check=Q(price__gte=0),
                name='cart_price_over_zero'
            )
        ]

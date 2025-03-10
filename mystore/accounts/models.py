from accounts.choices import Genders
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _


class Address(models.Model):
    """This represents billing information which
    can be totally different from the main account's
    information"""

    user_profile = models.ForeignKey(
        'UserProfile',
        on_delete=models.CASCADE
    )
    firstname = models.CharField(
        max_length=100
    )
    lastname = models.CharField(
        max_length=100
    )
    address_line = models.CharField(
        max_length=100
    )
    zip_code = models.PositiveIntegerField(
        validators=[]
    )
    country = models.CharField(
        max_length=100,
        default='France'
    )
    city = models.CharField(
        max_length=100,
        default='Nord'
    )
    telephone = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    gender = models.IntegerField(
        choices=Genders.choices,
        default=Genders.WOMAN
    )
    is_active = models.BooleanField(
        default=False
    )
    created_on = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f'{self.pk}: {self.user_profile}'

    @property
    def get_full_name(self):
        return f'{self.firstname} {self.lastname}'

    @property
    def get_full_address_line(self):
        return f'{self.address_line}, {self.city}, {self.zip_code}'


class UserProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )
    stripe_id = models.CharField(
        max_length=100,
        help_text=_(
            "The token that identifies the customer "
            "in Stripe e.g. cus_1234"
        ),
        blank=True,
        null=True
    )
    source_id = models.CharField(
        max_length=100,
        help_text=_(
            "The token that identifies the customer's "
            "payment method in Stripe e.g. card_1234"
        ),
        blank=True,
        null=True
    )
    telephone = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    created_on = models.DateField(
        auto_now_add=True
    )

    def __str__(self):
        return f'Profile: {self.user}'

    @property
    def has_payment_method(self):
        return self.source_id is not None


@receiver(post_save, sender=User)
def create_profile(instance, created, **kwargs):
    if created:
        instance = UserProfile.objects.create(user=instance)

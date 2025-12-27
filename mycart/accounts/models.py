from accounts import tasks
from accounts.choices import Genders
from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _


class Address(models.Model):
    """TThis model stores the address information for the customer
    which is used for billing and shipping purposes."""

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
        max_length=100,
        help_text=_(
            "The main address line for billing such as Address line 1, such "
            "as the street, PO Box, or company name."
        )
    )
    address_line_two = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text=_(
            "The second address line for billing such as Address line 2, "
            "such as apartment, suite, unit, building, floor, etc."
        )
    )
    zip_code = models.PositiveIntegerField(
        validators=[]
    )
    country = models.CharField(
        max_length=100,
        default='FR'
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
        get_user_model(),
        on_delete=models.CASCADE,
        related_name='userprofile'
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


@receiver(post_save, sender=get_user_model())
def create_profile(instance, created, **kwargs):
    """Creates a user profile when a new user is created and
    schedules a task to create a Stripe customer"""
    if created:
        UserProfile.objects.create(user=instance)
        tasks.create_stripe_customer.apply_async(
            args=[instance.email],
            countdown=15
        )


@receiver(post_save, sender=UserProfile)
def update_profile(instance, created, **kwargs):
    """Updates the Stripe customer information
    when the user information is updated"""
    if not created:
        tasks.update_stripe_customer.apply_async(
            args=[instance.user.email],
            countdown=15
        )

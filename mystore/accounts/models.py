from accounts.choices import Genders
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _


class Address(models.Model):
    """Represents the address billing information of a user.

    Attributes:
        user_profile (UserProfile): The user profile associated with this address
        firstname (str): The first name of the user
        lastname (str): The last name of the user
        address_line (str): The address line
        zip_code (int): The zip code of the address
        country (str): The country of the address
        city (str): The city of the address
        telephone (str): The telephone number of the user
        gender (int): The gender of the user
        is_active (bool): Indicates if the address is active
        created_on (datetime): The date and time when the address was created
    """

    user_profile = models.ForeignKey(
        'accounts.UserProfile',
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
    """Represents the main account information which can be used 
    for billing but also for other purposes like sending notifications, etc.

    Attributes:
        user (User): The user associated with this profile
        stripe_id (str): The token that identifies the customer in Stripe e.g. cus_1234
        source_id (str): The token that identifies the customer's payment method in Stripe e.g. card_1234
        telephone (str): The user's telephone number
        created_on (date): The date when the profile was created
    """

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

from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from accounts.choices import Genders


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
        return f'Address: {self.user_profile}'


class UserProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )
    stripe_id = models.CharField(
        max_length=100,
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
        return f'User: {self.user}'


@receiver(post_save, sender=User)
def create_profile(instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

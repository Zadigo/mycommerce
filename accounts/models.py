from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Address(models.Model):
    user_profile = models.ForeignKey(
        'UserProfile',
        on_delete=models.CASCADE
    )
    address = models.CharField(
        max_length=100
    )
    zip_code = models.PositiveIntegerField()

    def __str__(self):
        return self.address


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
    created_on = models.DateField(auto_now_add=True)

    def __str__(self):
        return str(self.user)


@receiver(post_save, sender=User)
def create_profile(instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

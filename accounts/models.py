from django.contrib.auth.models import User
from django.db import models

# class Address(models.Model):
#     address = models.CharField(
#         max_length=100
#     )
#     zip_code = models.PositiveIntegerField()
    

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
        return self.user
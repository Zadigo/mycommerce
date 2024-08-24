from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError


def check_password_validator(value):
    validate_password(value)
    
from rest_framework.exceptions import ValidationError


class ProductActiveError(ValidationError):
    """Product is not active in the
    database"""

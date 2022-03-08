from django.forms import ValidationError


def validate_quantity(value):
    if value > 99:
        raise ValidationError('Can only order a maximum of 99 products')
    return value

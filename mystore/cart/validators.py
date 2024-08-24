from rest_framework.validators import ValidationError


def validate_quantity(value):
    if value < 1 or value > 99:
        raise ValidationError({
            'quantity': 'Quantity number is not valid'
        })

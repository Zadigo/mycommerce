from django.forms import ValidationError


def validate_percentage(value):
    if value > 100:
        raise ValidationError('Percentage should not be above 100')
    return value

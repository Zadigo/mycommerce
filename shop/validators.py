from django.forms import ValidationError
from django.utils.crypto import get_random_string
from django.core.validators import FileExtensionValidator

CLOTHE_SIZES = ['XS', 'S', 'M', 'L', 'XL']

def validate_video_file_extension(name):
    instance = FileExtensionValidator(allowed_extensions=['mp4'])
    return instance(name)


def price_validator(value):
    if value <= 0:
        raise ValidationError('Price should be above 0')
    return value


def validate_variant(value):
    return []



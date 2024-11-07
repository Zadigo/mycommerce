from django.core.validators import FileExtensionValidator
from django.forms import ValidationError
from django.utils.translation import gettext_lazy as _

CLOTHE_SIZES = ['XS', 'S', 'M', 'L', 'XL']


def validate_video_file_extension(name):
    instance = FileExtensionValidator(allowed_extensions=['mp4'])
    instance(name)


def price_validator(value):
    if value <= 0:
        raise ValidationError(
            _("The product's price should be at least above 0"))
    return value

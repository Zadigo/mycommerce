import re

from django.core.validators import FileExtensionValidator
from django.forms import ValidationError
from django.utils.translation import gettext_lazy as _

CLOTHE_SIZES = ['XS', 'S', 'M', 'L', 'XL']


def validate_video_file_extension(name: str):
    """Validator that checks if the uploaded video file has a valid extension."""
    instance = FileExtensionValidator(allowed_extensions=['mp4'])
    instance(name)


def price_validator(value: int | float):
    """Validator that checks if the price is a positive number."""
    if value <= 0:
        raise ValidationError(_("The product's price should be at least 1"))
    return value


def validate_model_height(value: str):
    """Validator that checks if the model height is a valid number between 160 and 220 cm."""
    result = re.match(r'^\d{3}$', value)
    if not result:
        raise ValidationError(_("Model height is not valid"))

    height = int(result.group(0))
    if height < 160 or height > 220:
        raise ValidationError(
            _("Model height should be between 160 and 220 cm"))

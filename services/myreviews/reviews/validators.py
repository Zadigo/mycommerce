from django.core.validators import FileExtensionValidator
from django.forms import ValidationError

def validate_video(name):
    return FileExtensionValidator(['mp4'])(name)


def validate_rating(value):
    if value > 5:
        raise ValidationError('Rating should be between 1 and 5')
    return value

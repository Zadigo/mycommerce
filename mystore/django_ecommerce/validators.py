import re

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_siren(value):
    if value and len(value) != 9:
        raise ValidationError(_("SIREN should be 9 characters long"))


def validate_siret(value):
    if value and len(value) != 9:
        raise ValidationError(_("SIRET should be 15 characters long"))


def validate_ape(value):
    result = re.match(r'^\d{5}[A-Z]{1}$', value)
    if not result:
        raise ValidationError("APE is not formatted correctly e.g. 12345A")

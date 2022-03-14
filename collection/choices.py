from django.db.models import Choices
from django.utils.translation import gettext_lazy as _

class CollectionCategories(Choices):
    COATS = _('Coats')
    DRESSES = _('Dresses')
    LINGERIE = _('Lingerie')
    PANTS = _('Pants')
    SHORTS = _('Shorts')
    SKIRTS = _('Skirts')
    
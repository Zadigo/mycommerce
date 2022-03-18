from django.db.models import Choices
from django.utils.translation import gettext_lazy as _

# TODO: This requires more categories
# including personalized ones
class CollectionCategoryChoices(Choices):
    ACCESSORIES = _('Accessories')
    ACTIVEWEAR = _('Activewear')
    BAGS = _('Bags')
    BRAS = _('Bras')
    DENIM = _('Denim')
    DRESSES = _('Dresses')
    PANTS = _('Pants')
    PANTIES = _('Panties')
    SHOES = _('Shoes')
    SHORTS = _('Shorts')
    SUITS = _('Suits')
    TOPS = _('Tops')
    

from django.db.models import Choices
from django.utils.translation import gettext_lazy as _


class ClotheSizesChoices:
    sizes = [
        ('Unique', 'Unique'),
        ('XXS', 'XXS'),
        ('XS', 'XS'),
        ('S', 'S'),
        ('M', 'M'),
        ('L', 'L'),
        ('XL', 'XL')
    ]
    
    @classmethod
    def choices(cls):
        return cls.sizes
    
    @classmethod
    def default(cls, size):
        candidates = list(filter(lambda x: size in x, cls.sizes))
        return candidates[0][-1]


class ShoeSizesChoices:
    sizes = []
    
    @classmethod
    def choices(cls):
        for i in range(0, 10):
            cls.sizes.append((f"{35 + i}", f"{35 + i}"))
        return cls.sizes

    @classmethod
    def default(cls, size) -> str:
        candidates = list(filter(lambda x: size in x, cls.sizes))
        return candidates[-1]


class VariantChoices(Choices):
    SIZE = 'Size'


class VariantSubcategoryChoices(Choices):
    NOT_ATTRIBUTED = 'Not attributed'
    SHOE_SIZE = 'Shoe size'
    BRA_SIZE = 'Bra size'


class ColorChoices(Choices):
    BLACK = 'Black'
    BEIGE = 'Beige'
    CAMEL = 'Camel'
    CHARCOAL = 'Charcoal'
    CREAM = 'Cream'
    GREEN = 'Green'
    GREY = 'Grey'
    MARINE = 'Marine'
    NAVY = 'Navy'
    RED = 'Red'
    TAUPE = 'Taupe'
    WHITE = 'White'
    YELLOW = 'Yellow'


class CategoryChoices(Choices):
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

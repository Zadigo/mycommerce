from django.db.models import Choices


class ClotheSizes:
    sizes = [
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
    def default(cls, size) -> str:
        candidates = filter(lambda x: size in x, cls.sizes)
        return candidates[-1]


class ShoeSizes:
    sizes = []
    
    @classmethod
    def choices(cls):
        for i in range(0, 10):
            cls.sizes.append((f"{35 + i}", f"{35 + i}"))
        return cls.sizes

    @classmethod
    def default(cls, size) -> str:
        candidates = filter(lambda x: size in x, cls.sizes)
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
    YELLOW = 'Yellos'

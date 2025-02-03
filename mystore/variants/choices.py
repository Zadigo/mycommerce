from django.db.models import Choices

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
    def default(cls, size) -> str:
        candidates = list(filter(lambda x: size in x, cls.sizes))
        return candidates[-1]


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


class VariantSubcategoryChoices(Choices):
    BRA_SIZE = 'Bra size'
    CLOTHE_SIZE = 'Clothe size'
    NOT_ATTRIBUTED = 'Not attributed'
    SHOE_SIZE = 'Shoe size'

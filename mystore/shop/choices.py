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
    """Generates shoe sizes"""
    sizes = []

    @classmethod
    def choices(cls):
        for i in range(0, 10):
            cls.sizes.append((f"{35 + i}", f"{35 + i}"))
        return cls.sizes

    @classmethod
    def default(cls, size):
        candidates = list(filter(lambda x: size in x, cls.sizes))
        return candidates[-1]


class ColorChoices(Choices):
    PRINT = 'Print'
    BLACK = 'Black'
    BEIGE = 'Beige'
    BROWN = 'Brown'
    CAMEL = 'Camel'
    CHARCOAL = 'Charcoal'
    CREAM = 'Cream'
    GREEN = 'Green'
    GREY = 'Grey'
    KAKI = 'Kaki'
    MARINE = 'Marine'
    NAVY = 'Navy'
    ORANGE = 'Orange'
    PINK = 'Pink'
    RED = 'Red'
    TAUPE = 'Taupe'
    WHITE = 'White'
    YELLOW = 'Yellow'

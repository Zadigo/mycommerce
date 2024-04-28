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
    PRINTS = 'Prints'
    BLACK = 'Black'
    BEIGE = 'Beige'
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


class CategoryChoices(Choices):
    ACCESSORIES = 'Accessories'
    ACTIVEWEAR = 'Activewear'
    BAGS = 'Bags'
    BRAS = 'Bras'
    DENIM = 'Denim'
    DRESSES = 'Dresses'
    PANTS = 'Pants'
    PANTIES = 'Panties'
    SHOES = 'Shoes'
    SHORTS = 'Shorts'
    SUITS = 'Suits'
    TOPS = 'Tops'


SUB_CATEGORIES = [
    {
        "category": "Dresses",
        "items": [
            "Bodycon",
            "Shift",
            "Sheath",
            "Strapless",
            "Bouffont",
            "A-line",
            "Tent",
            "Blouson",
            "Halter",
            "Slit",
            "Shirt",
            "Wrap",
            "Peplum",
            "Drop waist",
            "One shoulder",
            "Ball gown",
            "Empire",
            "Apron",
            "Peasant",
            "Bubble",
            "Babydoll",
            "Jumper",
            "Sun",
            "Yoke",
            "Tunic",
            "Princess",
            "Trapezoid",
            "Pegged",
            "V-line"
        ]
    },
    {
        "category": "Lingerie",
        "items": [
            "Brief",
            "Bikini",
            "Brazilian",
            "Hipster",
            "Bodyshort",
            "Control brief",
            "Thong",
            "G-String"
        ]
    },
    {
        "cateogry": "Bras",
        "items": [
            "Balconette",
            "Plunge",
            "Full cup",
            "T-Shirt",
            "Strapless",
            "Half cup",
            "Bralette",
            "Front fastening",
            "Sports",
            "Wired",
            "Nursing",
            "Sleep bra",
            "Underwire",
            "Minimizer",
            "Seamless",
            "Bullet",
            "Triangle",
            "Soft cup",
            "Corset"
        ]
    }
]


CUTS = [
    "Off shoulder",
    "High neck",
    "Sweetheart",
    "Semi Sweetheart",
    "Asymetric",
    "V neck",
    "Straight",
    "Cowl",
    "Plungeing",
    "Illusion",
    "Square",
    "Scoop",
    "Jewel",
    "Bateau",
    "Queen Ann",
    "Halter Neck",

    "Wide V Neck tie up",
    "Round double tie up",
    "Cross",
    "Halter tie up",
    "Halter with button",
    "Illusion with rounded keyhole"
]

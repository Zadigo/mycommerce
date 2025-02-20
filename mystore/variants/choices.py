from django.db.models import Choices

# TODO: Remove
# class ClotheSizesChoices:
#     sizes = [
#         ('Unique', 'Unique'),
#         ('XXS', 'XXS'),
#         ('XS', 'XS'),
#         ('S', 'S'),
#         ('M', 'M'),
#         ('L', 'L'),
#         ('XL', 'XL')
#     ]

#     @classmethod
#     def choices(cls):
#         return cls.sizes

#     @classmethod
#     def default(cls, size) -> str:
#         candidates = list(filter(lambda x: size in x, cls.sizes))
#         return candidates[-1]

# # TODO: Remove


# class ShoeSizesChoices:
#     sizes = []

#     @classmethod
#     def choices(cls):
#         for i in range(0, 10):
#             cls.sizes.append((f"{35 + i}", f"{35 + i}"))
#         return cls.sizes

#     @classmethod
#     def default(cls, size) -> str:
#         candidates = list(filter(lambda x: size in x, cls.sizes))
#         return candidates[-1]


# # TODO: Remove
# class VariantSubcategoryChoices(Choices):
#     BRA_SIZE = 'Bra size'
#     CLOTHE_SIZE = 'Clothe size'
#     NOT_ATTRIBUTED = 'Not attributed'
#     SHOE_SIZE = 'Shoe size'


class VariantMetrics(Choices):
    """The metric that will be used to evaluate
    the size of the item in Nuxt and the database"""

    BRA = 'Bra' # e.g. 80E
    CLOTHE = 'Clothe' # e.g. S, XS
    SHOE = 'Shoe' # e.g 38, 39...
    METRIC = 'Metric' # e.g centimeter, meter, milliliter...
    TEXT = 'Text' # e.g. 1 boîte cotons-tiges, 1 boîte cotons-tiges/100 pièces

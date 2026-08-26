from django.db.models import Choices


class VariantMetrics(Choices):
    """The metric that will be used to evaluate
    the size of the item in Nuxt and the database"""

    BRA = 'Bra'  # e.g. 80E
    CLOTHE = 'Clothe'  # e.g. S, XS
    SHOE = 'Shoe'  # e.g 38, 39...
    METRIC = 'Metric'  # e.g centimeter, meter, milliliter...
    TEXT = 'Text'  # e.g. 1 boîte cotons-tiges, 1 boîte cotons-tiges/100 pièces

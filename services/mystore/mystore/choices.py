import itertools

from django.db.models import Choices
from django.utils.translation import gettext_lazy as _

from mystore.constants import SKU, SUB_CATEGORIES


class ShipmentChoices(Choices):
    IN_HOUSE = 'In house'
    DHL = 'DHL'
    CHRONOPOST = 'Chronopost'
    COLISSIMO_STANDARD = 'Colissimo - Livraison standard'
    COLISSIMO_INTERNATIONAL = 'Colissimo International'
    COLIPOSTE_DOM_TOM = 'Coliposte DOM-TOM'
    COLIPOSTE_INTERNATIONAL = 'Coliposte International'
    RELAIS_COLIS = 'Relais colis'
    EN_MAGASIN = 'En magasin'


class CityChoices(Choices):
    LILLE = 'Lille'
    PARIS = 'Paris'


class CountryChoices(Choices):
    FRANCE = 'France'
    GUADELOUPE = 'Guadeloupe'
    MARTINIQUE = 'Martinique'
    MONACO = 'Monaco'
    REUNION = 'Réunion'


def flatten_choices(choices):
    items = map(lambda x: x[-1], choices.choices)
    return [{'id': i, 'name': choice} for i, choice in enumerate(items)]


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
    SKIRTS = 'Skirts'
    SHORTS = 'Shorts'
    SUITS = 'Suits'
    TOPS = 'Tops'
    NOT_ATTRIBUTED = 'Not attributed'
    OTHER = 'Other'


class SubCategoryChoices:
    """Returns a list of product 
    sub-categories"""

    sub_categories: list[tuple[str, str]] = []

    @classmethod
    def choices(cls) -> list[tuple[str, str]]:
        items = [category['items'] for category in SUB_CATEGORIES]
        result = list(itertools.chain(*items))
        result.append('Not attributed')
        result = sorted(result)
        item_tuples = [(category, category) for category in result]
        cls.sub_categories.extend(item_tuples)
        return cls.sub_categories

    @classmethod
    def default(cls, name):
        result = list(filter(lambda x: name in x, cls.choices()))
        if result:
            return list(result[-1])[0]
        return 'Not attributed'

    @classmethod
    def flat(cls):
        return list(item[0] for item in cls.choices())


def create_sku(name):
    for sku in SKU:
        pass

from django.db.models import Choices
from django.utils.translation import gettext_lazy as _
from collection.constants import SUB_CATEGORIES
import itertools

# TODO: This requires more categories
# including personalized ones


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


class SubCategoryChoices:
    sub_categories = []

    @classmethod
    def choices(cls):
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
            return result[-1]
        return ('Not attributed', 'Not attributed')

import itertools

from django.db.models import Choices

from mycommerce.constants import SUB_CATEGORIES
from django.db.models.functions import Lower

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

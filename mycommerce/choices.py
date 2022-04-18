from django.db.models import Choices

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

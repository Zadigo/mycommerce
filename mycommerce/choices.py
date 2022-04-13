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

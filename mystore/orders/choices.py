from django.db.models import Choices
from django.utils.translation import gettext_lazy as _


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

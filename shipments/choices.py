from django.db.models import Choices


class Transporters(Choices):
    IN_HOUSE = 'In house'
    DHL = 'DHL'
    POST_OFFICE = 'Post office'
    CHRONOPOST = 'Chronopost'
    
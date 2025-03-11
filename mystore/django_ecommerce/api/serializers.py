from rest_framework import fields
from rest_framework.serializers import Serializer


class LegalBusinessSerializer(Serializer):
    legal_name = fields.CharField()
    logo = fields.ImageField()
    return_fee = fields.DecimalField(5, 2)
    home_collection_return_fee = fields.DecimalField(5, 2)

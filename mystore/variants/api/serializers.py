from rest_framework import fields
from rest_framework.serializers import Serializer


class SizeSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField()
    availability = fields.BooleanField(default=True)

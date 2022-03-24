from rest_framework.serializers import Serializer
from rest_framework import fields


class ReviewMediaSerializer(Serializer):
    id = fields.IntegerField()
    image = fields.FileField()
    video = fields.FileField()


class ReviewSerializer(Serializer):
    id = fields.CharField(read_only=True)
    media = ReviewMediaSerializer(many=True)

    rating = fields.IntegerField(default=1)
    title = fields.CharField()
    comment = fields.CharField()
    created_on = fields.DateTimeField(read_only=True)

import json

import pandas
from django.core.validators import FileExtensionValidator
from django.db.models import Value
from rest_framework import fields
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.serializers import Serializer

from shop.api.serializers.shop import ImageSerializer
from shop.api.validators import validate_image_ids
from shop.models import Image, Product
from shop.utils import clean_text


class ValidateImageAssociation(Serializer):
    product = fields.IntegerField()
    images = fields.ListField(validators=[validate_image_ids])

    def update(self, instance, validated_data):
        images = Image.objects.filter(pk__in=validated_data['images'])
        if images.exists():
            instance.images.add(*images)
            instance.save()
        return instance


class ValidateUpdateProduct(Serializer):
    """Updates the characteristics of a
    given product in the store"""

    active = fields.BooleanField(default=False)

    def validate(self, attrs):
        return super().validate(attrs)

    def update(self, instance, validated_data):
        instance.active = validated_data['active']
        instance.save()
        return instance


class ValidateFileUpload(Serializer):
    file = fields.FileField()

    # def validate(self, attrs):
    #     file = attrs['file']
    #     validator = FileExtensionValidator(allowed_extensions=['json', 'csv'])
    #     validator(file.name)
    #     return super().validate(attrs)

    def create(self, validated_data):
        file = validated_data['file']

        expected_columns = ['name', 'price']
        df = pandas.read_json(file)

        actual_columns = []
        for column in df.columns:
            if column in expected_columns:
                actual_columns.append(column)

        if not actual_columns:
            raise ValidationError(detail={
                'columns': 'Missing columns'
            })

        df = df[actual_columns]
        df.name = df.name.map(clean_text)
        empty_names = df[df.name.isna()]
        df = df.loc[~df.name.isna()]
        print(df)

        def create_new_products():
            for row in df.itertuples(name='Product'):
                yield Product.objects.create(
                    name=Value(row.name),
                    price=Value(row.price)
                )
        # products = list(create_new_products())

        return [Product.objects.first()]


class AdminProductSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField()
    unit_price = fields.DecimalField(5, 2)
    get_main_image = ImageSerializer()
    images = ImageSerializer(many=True)
    active = fields.BooleanField()

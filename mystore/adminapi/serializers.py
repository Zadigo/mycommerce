from mimetypes import guess_type

import pandas
from django.core.validators import FileExtensionValidator
from django.db import IntegrityError
from rest_framework import fields
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import Serializer
from shop.api.serializers import ImageSerializer
from shop.api.validators import validate_image_ids
from shop.models import Image, Product
from shop.utils import clean_text
from mystore.choices import CategoryChoices, SubCategoryChoices


class ValidateImageAssociation(Serializer):
    product = fields.IntegerField()
    images = fields.ListField(validators=[validate_image_ids])

    def update(self, instance, validated_data):
        images = Image.objects.filter(pk__in=validated_data['images'])
        if images.exists():
            instance.images.add(*images)
            instance.save()
        return instance


class AdminProductSerializer(Serializer):
    """Updates the characteristics of a
    given product in the store"""

    file_names = fields.CharField(write_only=True)
    files = fields.FileField(write_only=True)

    id = fields.IntegerField(read_only=True)
    name = fields.CharField()
    color = fields.CharField()
    category = fields.CharField()
    sub_category = fields.CharField()
    # sizes = SizeSerializer(many=True)
    get_price = fields.DecimalField(5, 2)
    sale_value = fields.IntegerField()
    sale_price = fields.DecimalField(5, 2)
    on_sale = fields.BooleanField()
    # collection_set = CollectionSerializer(many=True)
    get_main_image = ImageSerializer(required=False)
    images = ImageSerializer(many=True, required=False)
    # video = VideoSerializer(required=False)
    color_variant_name = fields.CharField()
    is_new = fields.BooleanField()
    active = fields.BooleanField()
    display_new = fields.BooleanField()
    slug = fields.SlugField(read_only=True)
    modified_on = fields.DateField(read_only=True)
    created_on = fields.DateField(read_only=True)

    def update(self, instance, validated_data):
        skip_fields = [
            'images', 'is_new', 'get_price',
            'color_variant_name', 'get_main_image'
        ]
        for key, value in validated_data.items():
            if key in skip_fields:
                continue
            setattr(instance, key, value)
        instance.save()
        return instance


class NewProductSerializer(Serializer):
    id = fields.IntegerField(read_only=True)
    name = fields.CharField()
    category = fields.ChoiceField(
        CategoryChoices.choices, 
        default='Not attributed'
    )
    sub_category = fields.ChoiceField(
        SubCategoryChoices.choices(), 
        default='Not attributed'
    )

    def create(self, validated_data):
        skip_fields = []
        items_to_create = {}
        for key, value in validated_data.items():
            if key in skip_fields:
                continue
            items_to_create[key] = value

        instance = Product.objects.create(**items_to_create)

        # Create the related variants for
        # the given product
        return instance


class ValidateFileUpload(Serializer):
    file = fields.FileField()

    def validate(self, attrs):
        file = attrs['file']
        validator = FileExtensionValidator(allowed_extensions=['json', 'csv'])
        validator(file)

        max_accepted_size = 100 * 1000000
        if file.size > max_accepted_size:
            raise ValidationError({
                'file': 'The maximum size of a file should be 100MB'
            })
        return super().validate(attrs)

    def create(self, validated_data):
        file = validated_data['file']

        lhv, _ = guess_type(file.name)
        if lhv == 'application/json':
            df = pandas.read_json(file)
        elif lhv == 'application/vnd.ms-excel':
            df = pandas.read_csv(file)
        else:
            raise ValidationError({
                'file': 'Filetype is not valid. Accepted files are .json and .csv'
            })

        allowed_columns = ['name', 'color', 'price']

        columns_to_use = []
        for column in df.columns:
            if column in allowed_columns:
                columns_to_use.append(column)

        if not columns_to_use:
            raise ValidationError(detail={
                'columns': f'Missing one of the following columns: {','.join(allowed_columns)}'
            })

        df = df[columns_to_use]
        df.name = df.name.map(clean_text)
        empty_names = df[df.name.isna()]
        df = df.loc[~df.name.isna()]
        setattr(self, '_db_creation_errors', [])

        def create_new_products():
            for row in df.itertuples(name='Product'):
                try:
                    yield Product.objects.create(
                        name=row.name,
                        unit_price=row.price,
                        color=row.color
                    )
                except IntegrityError:
                    # Instead of raising an error with the
                    # creation process when we get an integrity
                    # error, just catch the products that were
                    # not created and return them to the user
                    self._db_creation_errors.append(row.name)
        products = list(create_new_products())
        return products


class AdminProductSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField()
    unit_price = fields.DecimalField(5, 2)
    get_main_image = ImageSerializer()
    images = ImageSerializer(many=True)
    active = fields.BooleanField()

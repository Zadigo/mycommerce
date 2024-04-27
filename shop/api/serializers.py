import json

from django.db.models import Value
import pandas
from django.core.validators import FileExtensionValidator
from rest_framework import fields
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.serializers import Serializer

from shop.api.validators import validate_image_ids
from shop.models import Image, Product
from shop.utils import clean_text
from variants.api.serializers import SizeSerializer


class CustomPagination(LimitOffsetPagination):
    default_limit = 34
    max_limit = 34


class ImageProductSerializer(Serializer):
    """Serializer for a product in a set
    of products to list for a given image"""

    id = fields.IntegerField()
    name = fields.CharField()
    # TODO: Implement rest of fields
    # variant = fields.CharField()
    # mid_size = fields.ImageField()
    # thumbnail = fields.ImageField()
    # is_main_image = fields.BooleanField()


class ImageSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField()
    product_set = ImageProductSerializer(many=True)
    original = fields.FileField()
    thumbnail = fields.FileField()
    mid_size = fields.FileField()


class ValidateImageFilter(Serializer):
    column = fields.CharField()
    operator = fields.CharField()
    value = fields.CharField()


class ValidateImageFiltersSerializer(Serializer):
    image_filters = ValidateImageFilter(many=True)

    def filter_images(self):
        queryset = Image.objects.all()
        serializer = ImageSerializer(instance=queryset, many=True)
        df = pandas.DataFrame(serializer.data)
        operators = self.validated_data['image_filters']
        operator_formats = {
            'Equals': "{lhv} == '{value}'"
        }
        for operator in operators:
            operator_format = operator_formats[operator['operator']]
            result = operator_format.format_map({
                'lhv': operator['column'].lower(),
                'value': operator['value']
            })
            df = df.query(result)
        return json.loads(df.to_json(orient='records', force_ascii=False))


class ProductSerializer(Serializer):
    """Serializer used for sending data
    to agents that require displaying all
    the product information"""

    id = fields.IntegerField()
    name = fields.CharField()
    category = fields.CharField()
    color = fields.CharField()
    category = fields.CharField()
    sizes = SizeSerializer(many=True)
    get_price = fields.DecimalField(5, 2)
    active = fields.BooleanField()

    # TODO: Implement the remaning fields
    # id = fields.IntegerField()
    # name = fields.CharField(required=False)
    # unit_price = fields.DecimalField(5, 2, required=False)
    # usd_unit_price = fields.DecimalField(5, 2, required=False)

    # # additional_variants = AdditionalVariantSerializer(many=True, required=False)
    get_main_image = ImageSerializer(required=False)
    images = ImageSerializer(many=True, required=False)
    # video = VideoSerializer(required=False)

    # get_price = fields.DecimalField(5, 2)
    # sale_value = fields.IntegerField()
    # sale_price = fields.DecimalField(5, 2)
    # on_sale = fields.BooleanField()

    # display_new = fields.BooleanField()
    slug = fields.SlugField(required=False)
    modified_on = fields.DateField(required=False)
    created_on = fields.DateField(required=False)


class AdminProductSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField()
    unit_price = fields.DecimalField(5, 2)
    get_main_image = ImageSerializer()
    images = ImageSerializer(many=True)
    active = fields.BooleanField()


# class ValidateFileImage(Serializer):
#     name = fields.CharField()
#     content = fields.FileField()


# class ValidateUploadImages(Serializer):
#     files = ValidateFileImage(many=True)

#     def save(self, request, **kwargs):
#         setattr(self, 'request', request)
#         return super().save(**kwargs)

#     def create(self, validated_data):
#         print(validated_data)
#         instance = Image.objects.first()
#         return instance


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

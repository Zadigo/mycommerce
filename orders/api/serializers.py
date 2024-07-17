from rest_framework import fields
from rest_framework.serializers import Serializer

from mycommerce.choices import ShipmentChoices
from shop.api.serializers.shop import ImageSerializer


class SimpleProductSerializer(Serializer):
    id = fields.IntegerField()
    images = ImageSerializer(many=True)
    slug = fields.SlugField()


class ProductHistorySerializer(Serializer):
    id = fields.IntegerField()
    product = SimpleProductSerializer()
    unit_price = fields.DecimalField(5, 2)


class CustomerOrderSerializer(Serializer):
    id = fields.IntegerField()
    reference = fields.CharField()
    products = ProductHistorySerializer(many=True)
    total = fields.DecimalField(5, 2)
    created_on = fields.DateTimeField()


class ValidateCustomerOrder(Serializer):
    pass


class DeliveryOptionsSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField()


class ValidateShipment(Serializer):
    session_id = fields.CharField()
    discount_code = fields.CharField(required=False)
    email = fields.CharField()
    firstname = fields.CharField()
    lastname = fields.CharField()
    address_line = fields.CharField()
    zip_code = fields.CharField()
    city = fields.CharField()
    country = fields.CharField()
    telephone = fields.CharField()
    delivery_option = fields.ChoiceField(
        ShipmentChoices.choices,
        default=ShipmentChoices.CHRONOPOST
    )

from orders.api.validators import validate_card_token, validate_intent_token
from rest_framework import fields
from rest_framework.serializers import Serializer
from shop.api.serializers.shop import ImageSerializer

from mystore.choices import ShipmentChoices


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
    """Serializer used to validate the shipping
    options for the given user. This used
    by the shipment page"""

    def __init__(self, request, **kwargs):
        super().__init__(**kwargs)
        self._request = request

    session_id = fields.CharField()
    email = fields.CharField()
    firstname = fields.CharField()
    lastname = fields.CharField()
    address_line = fields.CharField()
    zip_code = fields.CharField()
    city = fields.CharField()
    country = fields.CharField()
    telephone = fields.CharField()
    discount_code = fields.CharField(required=False)
    delivery_option = fields.ChoiceField(
        ShipmentChoices.choices,
        default='Chronopost'
    )

    def create(self, validated_data):
        billing_addresses = self._request.user.userprofile.address_set.all()
        params = {
            'firstname': validated_data['firstname'],
            'lastname': validated_data['lastname'],
            'address_line': validated_data['address_line'],
            'zip_code': validated_data['zip_code'],
            'country': validated_data['country'],
            'city': validated_data['city'],
            'telephone': validated_data['telephone'],
            'user_profile': self._request.user.userprofile
        }
        billing_address, state = billing_addresses.update_or_create(
            defaults=params,
            firstname=params['firstname'],
            lastname=params['lastname'],
            address_line=params['address_line']
        )

        active_addresses = billing_addresses.filter(is_active=True)
        if not active_addresses.exists():
            billing_addresses.update(is_active=False)
            billing_address.is_active = True
            billing_address.save()
        return billing_address


class ValidateOrder(Serializer):
    """Serializer used to create a new customer order
    by capturing a pre-existing payment intent"""

    token = fields.CharField(validators=[])
    session_id = fields.CharField(validators=[])
    card = fields.CharField(validators=[validate_card_token])
    intent = fields.CharField(validators=[])
    client_ip = fields.IPAddressField()
    delivery_option = fields.ChoiceField(
        ShipmentChoices.choices,
        default='Chronopost'
    )

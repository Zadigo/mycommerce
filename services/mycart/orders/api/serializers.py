from orders.api.validators import validate_card_token
from orders.choices import ShipmentChoices
from orders.models import CustomerOrder
from rest_framework import fields
from rest_framework.serializers import ModelSerializer, Serializer


class ProductSerializer(Serializer):
    id = fields.IntegerField()
    product = fields.JSONField(source='serialized_data')
    unit_price = fields.DecimalField(5, 2)
    created_on = fields.DateTimeField()


class CustomerOrderSerializer(Serializer):
    id = fields.IntegerField()
    reference = fields.CharField()
    products = ProductSerializer(many=True, source='product_set')
    total = fields.DecimalField(5, 2)
    created_on = fields.DateTimeField()


class ValidateCustomerOrder(Serializer):
    pass


class DeliveryOptionsSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField()


class ValidateCreateIntent(Serializer):
    """Serializer used to validate the creation of a 
    new payment intent. Payment intents are created as early
    as possible in Nuxt
    
    Args:
        session_id: The session id of the current user session (Firebase Key)
        total: The total amount of the order, used to create the payment Intent 
    """
    session_id = fields.CharField()
    total = fields.FloatField(default=0.0)


class ValidateShipment(Serializer):
    """Serializer used to validate the shipping
    options for the given user. This is used
    for the shipping page and alternatively used
    to update an existing payment intent"""

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


class ValidateUpdateIntent(Serializer):
    """Serializer used to validate the shipping
    options for the given user. This used
    by the shipment page"""

    intent = fields.CharField(allow_null=True, validators=[])
    session_id = fields.CharField()
    total = fields.FloatField(allow_null=True)
    shipment = ValidateShipment(allow_null=True)


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


class CancelOrderSerializer(ModelSerializer):
    refund_requested = fields.BooleanField(default=True)

    class Meta:
        model = CustomerOrder
        fields = ['id', 'reference', 'refund_requested']

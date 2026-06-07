import graphene
from graphene_django import DjangoObjectType
from variants.models import Size


class SizeType(DjangoObjectType):
    variant_price = graphene.Float(source='attributed_price')

    class Meta:
        model = Size
        fields = [
            'name', 'metric',
            'availability', 'active'
        ]


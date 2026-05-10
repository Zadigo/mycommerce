import graphene
from django.core.cache import cache
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


class VariantQuery(graphene.ObjectType):
    all_sizes = graphene.List(SizeType)

    def resolve_all_sizes(self, info, **kwargs):
        qs = cache.get('allSizes')
        if not qs:
            qs = Size.objects.select_related('product').all()
            cache.set('allSizes', qs, 60*15)  # Cache for 15 minutes
        return qs

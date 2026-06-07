import graphene
from django.core.cache import cache
from variants.models import Size
from variants.graphql.types import SizeType
from graphql import GraphQLResolveInfo

class VariantQuery(graphene.ObjectType):
    all_sizes = graphene.List(SizeType)

    def resolve_all_sizes(self, info: GraphQLResolveInfo, **kwargs):
        qs = cache.get('allSizes')
        if not qs:
            qs = Size.objects.select_related('product').all()
            cache.set('allSizes', qs, 60*15)  # Cache for 15 minutes
        return qs

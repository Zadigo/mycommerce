import graphene
from shop.schema import ProductQuery
from variants.schema import VariantQuery
from collection.schema import CollectionsQuery


class Query(CollectionsQuery, VariantQuery, ProductQuery, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query)

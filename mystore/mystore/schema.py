import graphene
from collection.schema import CollectionsQuery
from shop.schema import ProductQuery
from variants.schema import VariantQuery


class Query(CollectionsQuery, VariantQuery, ProductQuery, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query)

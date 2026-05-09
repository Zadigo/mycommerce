import graphene
from mystore.collection.schema import CollectionsQuery
from mystore.shop.schema import ProductQuery
from mystore.variants.schema import VariantQuery


class Query(CollectionsQuery, VariantQuery, ProductQuery, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query)

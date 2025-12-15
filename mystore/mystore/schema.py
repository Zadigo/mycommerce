import graphene
from shop.schema import ProductQuery


class StoreQuery(ProductQuery, graphene.ObjectType):
    pass


schema = graphene.Schema(query=StoreQuery)

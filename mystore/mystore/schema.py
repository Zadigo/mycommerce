import graphene
from collection.graphql.schema import CollectionsQuery
from shop.graphql.schema import ProductQuery
from variants.schema import VariantQuery


class Query(
    CollectionsQuery, 
    VariantQuery, 
    ProductQuery, 
    graphene.ObjectType
):
    pass


schema = graphene.Schema(query=Query)

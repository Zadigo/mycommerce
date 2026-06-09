import graphene
from collection.graphql.schema import CollectionsQuery
from shop.graphql.schema import ProductQuery, ImageQuery
from variants.graphql.schema import VariantQuery


class Query(
    CollectionsQuery, 
    VariantQuery, 
    ProductQuery, 
    ImageQuery,
    graphene.ObjectType
):
    pass


schema = graphene.Schema(query=Query)

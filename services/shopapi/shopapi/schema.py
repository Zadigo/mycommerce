import graphene
from accounts.graphql.schema import UserProfileQuery, UserQuery
from collection.graphql.schema import CollectionsQuery
from shop.graphql.schema import ImageQuery, ProductQuery
from variants.graphql.schema import VariantQuery


class Query(
    CollectionsQuery, 
    VariantQuery, 
    ProductQuery, 
    ImageQuery,
    UserQuery,
    UserProfileQuery,
    graphene.ObjectType
):
    pass


schema = graphene.Schema(query=Query)

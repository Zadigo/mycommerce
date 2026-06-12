import graphene
from graphql import GraphQLResolveInfo
from collection.models import Collection
from graphene_django import DjangoObjectType
import graphene
from graphene import relay
from graphene_django import DjangoObjectType
from shop.graphql.types import ProductType
from shop.models import Product


class CollectionType(DjangoObjectType):
    number_of_items = graphene.Int()
    view_name = graphene.String(source='get_view_name')

    class Meta:
        model = Collection
        fields = [
            'name', 'category', 'sub_category',
            'description', 'illustration', 'number_of_items',
            'tags', 'slug', 'subcategory_slug', 'created_on'
        ]

    def resolve_products(self, info: GraphQLResolveInfo):
        return self.products.all()

    def resolve_illustration(self, info: GraphQLResolveInfo):
        if self.illustration:
            return self.illustration.url
        return None

    def resolve_get_view_name(self, info: GraphQLResolveInfo):
        return f'/collections/{self.view_name}/'


class FilteredCollectionType(DjangoObjectType):
    products = graphene.List(ProductType)

    class Meta:
        model = Collection
        interfaces = (relay.Node,)
        filter_fields = {
            'name': ['exact', 'icontains', 'istartswith'],
            'category': ['exact', 'icontains'],
            'sub_category': ['exact', 'icontains'],
            'tags': ['exact', 'icontains'],
        }

    def resolve_products(self, info: GraphQLResolveInfo):
        return self.products.all()


class CollectionConnection(relay.Connection):
    class Meta:
        node = FilteredCollectionType

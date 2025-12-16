import graphene
from collection.models import Collection
from django.core.cache import cache
from django.db import models
from graphene import relay
from graphene_django import DjangoObjectType
from shop.schema import ProductType


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

    def resolve_products(self, info):
        return self.products.all()

    def resolve_illustration(self, info):
        if self.illustration:
            return self.illustration.url
        return None

    def resolve_get_view_name(self, info):
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

    def resolve_products(self, info):
        return self.products.all()


class CollectionConnection(relay.Connection):
    class Meta:
        node = FilteredCollectionType


class CollectionsQuery(graphene.ObjectType):
    collection = graphene.Field(
        CollectionType,
        id=graphene.Int(),
    )
    all_collections = graphene.List(
        CollectionType
    )
    search_collection = relay.ConnectionField(
        CollectionConnection,
        name=graphene.String(required=True),
        product_name=graphene.String(required=False)
    )

    def resolve_collection(self, info, name):
        return Collection.objects.get(name=name)

    def resolve_all_collections(self, info, **kwargs):
        qs = cache.get('allCollections')
        if not qs:
            qs = Collection.objects.prefetch_related('products').all()
            cache.set('allCollections', qs, 60*15)  # Cache for 15 minutes
        return qs

    def resolve_search_collection(self, info, name, product_name=None, **kwargs):
        try:
            collection = Collection.objects.get(name=name)
        except Collection.DoesNotExist:
            raise Exception("No collection found with the given name.")
        else:
            cache_key = f'searchCollection_{name}_{product_name}'
            qs = cache.get(cache_key)

            if not qs:
                qs = collection.products.filter(
                    models.Q(name__icontains=product_name)
                )
                cache.set(cache_key, qs, 60*15)  # Cache for 15 minutes
            return qs

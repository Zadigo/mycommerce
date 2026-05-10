import graphene
from collection.models import Collection
from django.core.cache import cache
from django.db import models
from graphene import relay
from collection.graphql.types import CollectionType, CollectionConnection

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

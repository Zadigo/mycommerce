import graphene
from graphql import GraphQLResolveInfo
from collection.models import Collection
from django.core.cache import cache
from django.db import models
from graphene import relay
from typing import Optional
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
        product_name=graphene.String(required=False),
        category=graphene.String(required=False)
    )

    def resolve_collection(self, info: GraphQLResolveInfo, name: str, **kwargs):
        return Collection.objects.get(name=name)

    def resolve_all_collections(self, info: GraphQLResolveInfo, **kwargs):
        qs = cache.get('allCollections')
        if not qs:
            qs = Collection.objects.prefetch_related('products').all()
            cache.set('allCollections', qs, 60*15)  # Cache for 15 minutes
        return qs

    def resolve_search_collection(self, info: GraphQLResolveInfo, name: str, product_name: Optional[str] = None, category: Optional[str] = None, **kwargs):
        cache_key = f'searchCollection_{name}'

        if product_name is not None:
            cache_key += f'_{product_name}'

        if category is not None:
            cache_key += f'_{category}'

        item = cache.get(cache_key)
        if item is None:
            logic = models.Q(name__icontains=name)

            if product_name is not None:
                logic &= models.Q(products__name__icontains=product_name)

            if category is not None:
                logic &= models.Q(category__icontains=category)
            
            item = Collection.objects.filter(logic)

            cache.set(cache_key, item, 60*15)  # Cache for 15 minutes
        return item

import random
from typing import Optional

import graphene
from django.core.cache import cache
from graphene import relay
from graphql import GraphQLResolveInfo

from mystore.custom_utilities.word_processor import FuzzyMatcher
from shop.graphql.types import (
    ImageType,
    ProductConnection,
    ProductNoveltyConnection,
    ProductNoveltyType,
    ProductType,
    RecommendationsType,
    VideoType,
)
from shop.models import Image, Novelty, Product
from shop.utils import transform_to_snake_case


class ProductQuery(graphene.ObjectType):
    all_products = relay.ConnectionField(
        ProductConnection
    )
    product = relay.Node.Field(
        ProductType
    )

    search_products = relay.ConnectionField(
        ProductConnection,
        name=graphene.String(),
        sku=graphene.String(),
        color=graphene.String(),
        min_price=graphene.Float(),
        max_price=graphene.Float(),
        sale_value=graphene.Float(),
        slug=graphene.String()
    )

    products_by_category = relay.ConnectionField(
        ProductConnection,
        category=graphene.String(required=True),
        color=graphene.String(),
        size=graphene.String(),
        order_by=graphene.String(),
        min_price=graphene.Float(required=False),
        max_price=graphene.Float(required=False)
    )

    all_images = graphene.List(
        ImageType
    )
    all_videos = graphene.List(
        VideoType
    )

    product_novelty = relay.Node.Field(
        ProductNoveltyType
    )
    all_product_novelties = relay.ConnectionField(
        ProductNoveltyConnection
    )

    recommendations = graphene.List(
        RecommendationsType,
        product_name=graphene.String(required=False),
        product_category=graphene.String(required=False),
        quantity=graphene.Int(required=False, default_value=10)
    )

    def resolve_all_products(self, info: GraphQLResolveInfo, **kwargs):
        qs = cache.get('allProducts')
        if not qs:
            qs = Product.objects.prefetch_related(
                'product_images', 'video').all()
            cache.set('allProducts', qs, 60*15)  # Cache for 15 minutes
        return qs
    
    # def resolve_get_product(self, info: GraphQLResolveInfo, **kwargs):
    #     return Product.objects.get(pk=kwargs.get('id'))

    def resolve_all_product_novelties(self, info: GraphQLResolveInfo, **kwargs):
        return Novelty.objects.all()

    def resolve_search_products(self, info: GraphQLResolveInfo, **kwargs):
        name = kwargs.get('name')
        sku = kwargs.get('sku')
        color = kwargs.get('color')
        unit_price = kwargs.get('unit_price')
        sale_value = kwargs.get('sale_value')
        slug = kwargs.get('slug')

        filter_args = {}

        if name:
            filter_args['name__icontains'] = name

        if sku:
            filter_args['sku__exact'] = sku

        if color:
            filter_args['color__icontains'] = color

        if unit_price is not None:
            filter_args['unit_price__exact'] = unit_price

        if sale_value is not None:
            filter_args['sale_value__exact'] = sale_value

        if slug:
            filter_args['slug__exact'] = slug

        cache_key = '_'.join(filter_args.keys())
        qs = cache.get('searchProducts_' + cache_key)

        if qs is None:
            qs = Product.objects.filter(**filter_args)
            cache.set('searchProducts_' + cache_key,
                      qs, 60*10)  # Cache for 10 minutes

        return qs

    def resolve_all_images(self, info: GraphQLResolveInfo, **kwargs):
        return Image.objects.all()

    def resolve_products_by_category(self, info: GraphQLResolveInfo, category: str, min_price: Optional[int]=None, max_price: Optional[int]=None, **kwargs):
        cache_key = f'productsByCategory_{category}'
        qs = cache.get(cache_key)

        if qs is None:
            qs = Product.objects.prefetch_related(
                'product_images', 'video').filter(category__icontains=category)
            cache.set(cache_key, qs, 60*10)  # Cache for 10 minutes

        if min_price is not None:
            qs = qs.filter(unit_price__gte=min_price)

        if max_price is not None:
            qs = qs.filter(unit_price__lte=max_price)

        return qs

    def resolve_recommendations(self, info: GraphQLResolveInfo, product_name: Optional[str]=None, product_category: Optional[str]=None, quantity: int=10, **kwargs):
        cache_key = 'productsForRecommendations'
        if product_name is not None:
            name = transform_to_snake_case(product_name)
            cache_key += f'_{name}'
        else:
            cache_key += '_all'
        
        qs = cache.get(cache_key)

        if not qs:
            qs = Product.objects.prefetch_related(
                'product_images',
                'video'
            ).all()
            cache.set(cache_key, qs, 60*60)  # Cache for 60 minutes

        matcher = FuzzyMatcher(threshold=0.6)

        if product_category is not None:
            qs = qs.filter(category__iexact=product_category)

        if product_name is not None:
            product_ids = []
            matched_products = list(
                filter(
                    lambda p: matcher.is_match(p.name, product_name),
                    qs
                )
            )

            product_ids.extend([product.id for product in matched_products])
            random.shuffle(product_ids)
            return qs.filter(id__in=product_ids)
        return qs[:quantity]

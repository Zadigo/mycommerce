import random

import graphene
from django.core.cache import cache
from graphene import relay
from mystore.shop.models import Image, Novelty, Product

from mystore.mystore.custom_utilities.word_processor import FuzzyMatcher
from mystore.shop.graphql.types import ProductConnection, ImageType, ProductType, ProductNoveltyType, ProductNoveltyConnection, RecommendationsType, VideoType

class ProductQuery(graphene.ObjectType):
    all_products = relay.ConnectionField(ProductConnection)
    product = relay.Node.Field(ProductType)

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
        name=graphene.String(required=True),
        color=graphene.String(),
        size=graphene.String(),
        order_by=graphene.String(),
        min_price=graphene.Float(required=False),
        max_price=graphene.Float(required=False)
    )

    all_images = graphene.List(ImageType)
    all_videos = graphene.List(VideoType)

    product_novelty = relay.Node.Field(ProductNoveltyType)
    all_product_novelties = relay.ConnectionField(ProductNoveltyConnection)

    recommendations = graphene.List(
        RecommendationsType,
        product_name=graphene.String(required=False),
        product_category=graphene.String(required=False),
        quantity=graphene.Int(required=False, default_value=10)
    )

    def resolve_all_products(self, info, **kwargs):
        qs = cache.get('allProducts')
        if not qs:
            qs = Product.objects.prefetch_related(
                'product_images', 'video').all()
            cache.set('allProducts', qs, 60*15)  # Cache for 15 minutes
        return qs
    
    # def resolve_get_product(self, info, **kwargs):
    #     return Product.objects.get(pk=kwargs.get('id'))

    def resolve_all_product_novelties(self, info, **kwargs):
        return Novelty.objects.all()

    def resolve_search_products(self, info, **kwargs):
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

    def resolve_all_images(self, info, **kwargs):
        return Image.objects.all()

    def resolve_products_by_category(self, info, name, min_price=None, max_price=None, **kwargs):
        cache_key = f'productsByCategory_{name}'
        qs = cache.get(cache_key)

        if qs is None:
            qs = Product.objects.prefetch_related(
                'product_images', 'video').filter(category__iexact=name)
            cache.set(cache_key, qs, 60*10)  # Cache for 10 minutes

        if min_price is not None:
            qs = qs.filter(unit_price__gte=min_price)

        return qs

    def resolve_recommendations(self, info, product_name=None, product_category=None, quantity=10, **kwargs):
        cache_key = 'productsForRecommendations'
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

        product_ids = []
        if product_name is not None:
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

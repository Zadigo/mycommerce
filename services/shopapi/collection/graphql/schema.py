import graphene
from django.core.cache import cache
from django.db import models
from django.utils import timezone
from graphene import Enum, relay
from graphql import GraphQLResolveInfo

from collection.graphql.types import CollectionConnection, CollectionType
from collection.models import Collection


class SortDirections(Enum):
    ASC = 'ASC'
    DESC = 'DESC'

class PriceLimits(Enum):
    UP_TO_15 = 'Up to 15'
    UP_TO_20 = 'Up to 20'
    UP_TO_25 = 'Up to 25'
    UP_TO_30 = 'Up to 30'
    UP_TO_35 = 'Up to 35'


class CollectionsQuery(graphene.ObjectType):
    all_collections = graphene.List(
        CollectionType
    )
    collection = graphene.Field(
        CollectionType,
        id=graphene.Int(),
    )
    search_collection = relay.ConnectionField(
        CollectionConnection,
        name=graphene.String(required=True),
        product_name=graphene.String(required=False),
        category=graphene.String(required=False),
        sub_category=graphene.String(required=False),
        on_sale=graphene.Boolean(required=False),
        sortPrice=SortDirections(required=False),
        priceLimit=PriceLimits(required=False),
        sizes=graphene.List(graphene.String, required=False),
        colors=graphene.List(graphene.String, required=False),
        typology=graphene.List(graphene.String, required=False)
    )

    def resolve_collection(self, info: GraphQLResolveInfo, name: str, **kwargs):
        return Collection.objects.get(name=name)

    def resolve_all_collections(self, info: GraphQLResolveInfo, **kwargs):
        qs = cache.get('allCollections')
        if not qs:
            qs = Collection.objects.prefetch_related('products').all()
            cache.set('allCollections', qs, 60*15)  # Cache for 15 minutes
        return qs

    def resolve_search_collection(self, info: GraphQLResolveInfo, **kwargs: str):
        cache_duration: int = 60*15  # Cache for 15 minutes

        name = kwargs.get('name')
        product_name = kwargs.get('product_name', None)
        category = kwargs.get('category', None)
        sub_category = kwargs.get('sub_category', None)
        on_sale = kwargs.get('on_sale', None)

        other_cache_keys: list[str] = [f'searchCollection_{name}']
        logic = models.Q(name__icontains=name)

        if product_name is not None:
            other_cache_keys.append(product_name)
            logic &= models.Q(products__name__icontains=product_name)

        if category is not None:
            other_cache_keys.append(category)
            logic &= models.Q(category__icontains=category)

        if sub_category is not None:
            other_cache_keys.append(sub_category)
            logic &= models.Q(sub_category__icontains=sub_category)

        if on_sale is not None:
            other_cache_keys.append(str(on_sale))
            logic &= models.Q(products__on_sale=on_sale)

        def get_cache_key(*values):
            return '_'.join(values).lower()
        
        cache_key = get_cache_key(*other_cache_keys)
        qs = cache.get(cache_key)

        if qs is None:
            qs = Collection.objects.all()

        sort_price = kwargs.get('sortPrice', None)
        price_limit = kwargs.get('priceLimit', None)
        sizes = kwargs.get('sizes', [])
        colors = kwargs.get('colors', [])
        typology = kwargs.get('typology', [])

        if price_limit is not None:
            other_cache_keys.append(price_limit.value)
            price_limit_map = {
                'Up to 15': 15,
                'Up to 20': 20,
                'Up to 25': 25,
                'Up to 30': 30,
                'Up to 35': 35,
                'Up to 50': 50,
            }
            value = price_limit_map.get(price_limit.value, None)

            if value is not None:
                condition = models.Q(products__on_sale=True) & models.Q(products__sale_price__gte=0)
                logic_price = models.Case(
                    models.When(condition, then='products__sale_price'),
                    default='products__unit_price'
                )
                qs = qs.annotate(price_to_use=logic_price).filter(price_to_use__lte=value)

        if colors is not None:
            for color in colors:
                other_cache_keys.append(color)
                qs = qs.filter(products__color__icontains=color)

        if sort_price is not None:
            other_cache_keys.append(sort_price.value)
            match sort_price:
                case SortDirections.ASC:
                    qs = qs.order_by('products__unit_price')
                case SortDirections.DESC:
                    qs = qs.order_by('-products__unit_price')

        match name:
            case 'all':
                other_cache_keys.append('all')
                cache.set(get_cache_key(*other_cache_keys), qs, cache_duration)
                return qs
            case 'sales':
                qs = qs.filter(logic)
                other_cache_keys.append('sales')
                cache.set(get_cache_key(*other_cache_keys), qs, cache_duration)
                return qs
            case 'novelties':
                difference = (timezone.now() - timezone.timedelta(days=5))
                qs = qs.filter(
                    models.Q(display_new=True) |
                    models.Q(created_on__gte=difference.date())
                )
                other_cache_keys.append('novelties')
                cache.set(get_cache_key(*other_cache_keys), qs, cache_duration)
                return qs
            case _:
                qs = qs.filter(logic)
                cache.set(cache_key, qs, cache_duration)
                return qs

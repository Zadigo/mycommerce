from collection.api import serializers
from collection.models import Collection
from django.core.cache import cache
from django.db.models import Q
from django.db.models.functions import Lower
from django.utils.timezone import now, timedelta
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from shop.api.serializers import ProductSerializer
from shop.models import Product
from hashlib import md5

from mystore.utils import PaginationHelper


def build_colors(colors):
    def build_color(name):
        return {'name': name, 'image': f"/media/{name.lower()}.png"}
    return map(build_color, colors)


class ListCollectionProducts(generics.ListAPIView):
    """Enpoint used to list the products from a
    given fashion collection. This endpoint works in
    two manners:

    First, the endpoint tries to match a collection with
    the parameter in the url. If the queryset exists then
    the data for this request is returned.

    Otherwise, if the category or sub_category is set directly 
    on the product, thus not included in a collection, then 
    a list of products which match the parameter of the request
    """

    queryset = Product.objects.filter(active=True)
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    default_cache_timeout = 1200

    def list(self, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        pagination_helper = PaginationHelper()
        pagination_helper(self.request, queryset, self.serializer_class)

        template = pagination_helper.get_custom_response_template()
        template['infos'] = {'total_count': queryset.count()}
        return Response(template)

    def get_queryset(self):
        queryset = super().get_queryset()
        collection_name = self.kwargs['name']

        # NOTE: Remove the caching for now for testing
        # purposes
        # state = cache.has_key(collection_name)
        # if state:
        #     return cache.get(collection_name)

        cache_params = {
            'key': None,
            'value': queryset,
            'timeout': self.default_cache_timeout
        }

        # Cache the whole collection but also
        # sub-categories located under the
        # given collection
        other_cache_keys = []

        sub_category = self.request.GET.get('s', None)
        if sub_category is not None:
            other_cache_keys.append(sub_category)
            queryset = queryset.filter(sub_category=sub_category)

        sorted_by = self.request.GET.get('sorted_by', 'New')
        typology = self.request.GET.getlist('typology')
        colors = self.request.GET.getlist('colors')
        sizes = self.request.GET.getlist('sizes')
        price = self.request.GET.get('price', None)

        # other_cache_keys.append(sorted_by)
        # if sorted_by == 'Price up':
        #     queryset = queryset.order_by('-unit_price')
        # elif sorted_by == 'Price down':
        #     queryset = queryset.order_by('unit_price')
        # else:
        #     queryset = queryset.order_by('-created_on')

        # other_cache_keys.extend(sizes)
        # if sizes:
        #     queryset = queryset.filter(size__name__in=sizes)

        # if price is not None:
        #     other_cache_keys.append(price)
        #     price_limit_map = {
        #         'Up to 10': 10,
        #         'Up to 20': 20,
        #         'Up to 30': 30,
        #         'Up to 40': 40
        #     }
        #     value = price_limit_map[price]
        #     queryset = queryset.filter(unit_price__lte=value)

        def create_cache_key(*values):
            """Return a hash which is the unique combination
            of every possible filters on the product provided
            to the user"""
            tokens = '-'.join(values).lower()
            return md5(tokens.encode()).hexdigest()

        if collection_name == 'all':
            cache_params['key'] = create_cache_key('all', *other_cache_keys)
            cache.set(**cache_params)
            return queryset
        elif collection_name == 'novelties':
            difference = (now() - timedelta(days=5))
            queryset = queryset.filter(
                Q(display_new=True) |
                Q(created_on__gte=difference.date())
            )
            cache.set(
                create_cache_key(collection_name, *other_cache_keys),
                queryset,
                timeout=self.default_cache_timeout
            )
            cache_params['key'] = 'novelties'
            cache_params['value'] = queryset
            cache.set(**cache_params)
            return queryset
        else:
            queryset = self.queryset.filter(
                collection__category__iexact=collection_name)

            # We have two ways to create a collection of
            # items. Either via the Collection model (manual)
            # or either dynamically using Product.category.
            # and this is the dynamic way
            if not queryset.exists():
                new_queryset = super().get_queryset()
                queryset = new_queryset.filter(
                    category__iexact=collection_name
                )

                if not new_queryset.exists():
                    return []

            products = queryset.order_by('-created_on')
            cache_params['key'] = create_cache_key(
                collection_name,
                *other_cache_keys
            )

            cache_params['value'] = products
            cache.set(**cache_params)
            return products


class ListCollections(generics.ListAPIView):
    """List all the collections that were created
    in the database"""

    queryset = Collection.objects.all()
    serializer_class = serializers.CollectionSerializer
    permission_classes = [AllowAny]

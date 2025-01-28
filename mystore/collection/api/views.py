from collection.api import serializers
from collection.models import Collection
from django.core.cache import cache
from django.db.models import Q
from django.utils.timezone import now, timedelta
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from shop.api.serializers import ProductSerializer
from shop.models import Product

from mystore.utils import PaginationHelper


def build_colors(colors):
    def build_color(name):
        return {'name': name, 'image': f"/media/{name.lower()}.png"}
    return map(build_color, colors)


class ListCollectionProducts(generics.ListAPIView):
    """Enpoint used to list the products from a
    given fashion collection"""

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

        state = cache.has_key(collection_name)
        if state:
            return cache.get(collection_name)

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

        def create_cache_key(*values):
            return '-'.join(values)

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
                Q(collection__name__icontains=collection_name) |
                Q(collection__slug__iexact=collection_name)
            )

            # We have two ways to create a collection of
            # items. Either via the Collection model (manual)
            # or either dynamically using Product.category.
            # and this is the dynamic way
            if not queryset.exists():
                newer_queryset = super().get_queryset()
                queryset = newer_queryset.filter(
                    category__iexact=collection_name
                )

                if not newer_queryset.exists():
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

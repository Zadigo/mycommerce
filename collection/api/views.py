from django.core.cache import cache
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils.timezone import now, timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
# from django.db.models
from collection.api import serializers
from collection.models import Collection
from mycommerce.utils import PaginationHelper
from shop.api.serializers.shop import ProductSerializer
from shop.models import Product


def build_colors(colors):
    def build_color(name):
        return {'name': name, 'image': f"/media/{name.lower()}.png"}
    return map(build_color, colors)


class ListCollectionProducts(ListAPIView):
    queryset = Product.objects.filter(active=True)
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    default_cache_timeout = 10

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

        if collection_name == 'all':
            cache_params['key'] = 'all'
            cache.set(**cache_params)
            return queryset
        elif collection_name == 'novelties':
            difference = (now() - timedelta(days=5))
            queryset = queryset.filter(
                Q(display_new=True) |
                Q(created_on__gte=difference.date())
            )
            cache.set(
                collection_name, 
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
            # or either dynamically using Product.category
            if not queryset.exists():
                queryset = queryset.filter(
                    category__iexact=collection_name
                )
                
            products = queryset.order_by('-created_on')
            cache_params['key'] = collection_name
            cache_params['value'] = products
            cache.set(**cache_params)
            return products 


class ListCollectionNames(ListAPIView):
    queryset = Collection.objects.all()
    serializer_class = serializers.CollectionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        if not self.queryset.exists():
            products = Product.objects.order_by()
            queryset = products.values('id', 'category', 'sub_category')
            return queryset.distinct('category')
        return self.queryset
    

class SearchCollectionProducts(RetrieveAPIView):
    queryset = Collection.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field

        assert lookup_url_kwarg in self.kwargs, (
            'Expected view %s to be called with a URL keyword argument '
            'named "%s". Fix your URL conf, or set the `.lookup_field` '
            'attribute on the view correctly.' %
            (self.__class__.__name__, lookup_url_kwarg)
        )

        # Instead of failing hard if the collection does not
        # exist, just return None. We'll use the Product.category
        # level to dynamically group the products
        filter_kwargs = {self.lookup_field: self.kwargs[lookup_url_kwarg]}
        queryset = self.queryset.filter(**filter_kwargs)
        if queryset.exists():
            obj = queryset.get()
            self.check_object_permissions(self.request, obj)
            return obj
        return None

    def get_queryset(self):
        collection = self.get_object()
        if collection is not None:
            products = collection.product_set.filter()
            return products
        else:
            products = Product.objects.all()
            return products


@api_view(['get'])
@permission_classes([AllowAny])
def list_collection_products(request, name, **kwargs):
    """Returns a specific collection"""
    queryset = Product.objects.filter(active=True)

    pagination_helper = PaginationHelper()
    if name == 'all':
        return pagination_helper(request, queryset, ProductSerializer)
    elif name == 'novelties':
        queryset = queryset.filter(display_new=True)
        return pagination_helper(request, queryset, ProductSerializer)
    else:
        queryset = Collection.objects.filter(
            Q(name__icontains=name) |
            Q(slug__iexact=name)
        )

        # We have two ways to create a collection of
        # items. Either via the Collection model (manual)
        # or either dynamically using Product.category
        if not queryset.exists():
            return Product.objects.filter(
                active=True,
                category__iexact=name
            )

        collection = get_object_or_404(Collection, slug__iexact=name)
        serializer = serializers.CollectionSerializer(instance=collection)
        # Since it's kinda complicated to paginate the
        # nested products, we integrate them afterwards after
        # having serialized the collection
        collection_data = serializer.data

        products = queryset.filter(
            collection__slug__iexact=name,
            active=True
        )
        products = products.order_by('-created_on')

        instance = pagination_helper(
            request,
            products,
            ProductSerializer,
            response_only=False
        )
        data_to_return = instance.get_template(collection=collection_data)
        data_to_return['infos'] = {'total_count': products.count()}
        return Response(data=data_to_return)


@api_view(['get'])
@permission_classes([AllowAny])
def list_collections(request, **kwargs):
    """Returns the names of all the collections
    that exist in the shop"""
    queryset = Collection.objects.all()
    serializer = serializers.CollectionSerializer(
        instance=queryset,
        many=True
    )
    return Response(data=serializer.data)


@api_view(['post'])
@permission_classes([AllowAny])
def search_collection_products(request, pk, **kwargs):
    """Search the products within a collection using
    certain specific set of criteria"""
    collection = get_object_or_404(Collection, id=pk)
    serializer = serializers.CollectionSerializer(instance=collection)
    collection_data = serializer.data

    search_serializer = serializers.SearchParametersSerializer(
        data=request.data
    )
    search_serializer.is_valid(raise_exception=True)
    search_params = search_serializer.data

    if not search_params:
        return Response(data=[])

    products = collection.products.filter(active=True)
    matching_names = search_serializer.search_name(products)
    are_on_sale = search_serializer.search_is_onsale(matching_names)
    products = search_serializer.search_color(are_on_sale)

    products_serializer = ProductSerializer(instance=products, many=True)
    paginator, serializer, _ = serializers.pagination_helper(
        request,
        products,
        ProductSerializer,
        has_many=True
    )
    paginated_products = paginator.get_response_dict(
        products_serializer.data
    )
    data_to_return = paginated_products | collection_data
    return Response(data=data_to_return)

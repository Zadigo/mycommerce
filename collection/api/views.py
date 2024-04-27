from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response

from collection.api import serializers
from collection.models import Collection
from mycommerce.utils import pagination_helper
from shop.api.serializers.shop import ProductSerializer
from shop.models import Product


def build_colors(colors):
    def build_color(name):
        return {'name': name, 'image': f"/media/{name.lower()}.png"}
    return map(build_color, colors)


@api_view(['get'])
def get_collection(request, name, **kwargs):
    """Returns a specific collection"""
    queryset = Product.objects.filter(active=True)

    if name == 'all':
        return pagination_helper(request, queryset, ProductSerializer)
    elif name == 'novelties':
        queryset = queryset.filter(display_new=True)
        return pagination_helper(request, queryset, ProductSerializer)
    else:
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

        paginator, serializer_instance, _ = pagination_helper(
            request,
            products,
            ProductSerializer,
            response_only=False
        )
        paginated_products = paginator.get_response_dict(
            serializer_instance.data
        )
        data_to_return = {**paginated_products, **collection_data}
        data_to_return['infos'] = {'total_count': products.count()}
        return Response(data=data_to_return)


@api_view(['get'])
def list_collection_names(request, **kwargs):
    """Returns the names of all the collections
    that exist in the shop"""
    queryset = Collection.objects.all()
    serializer = serializers.CollectionNameSerializer(
        instance=queryset,
        many=True
    )
    return Response(data=serializer.data)


@api_view(['post'])
def search_collection(request, pk, **kwargs):
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

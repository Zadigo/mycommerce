from collections import OrderedDict

from django.db.models.expressions import Q
from django.shortcuts import render
from mycommerce.responses import CustomPagination, api_response
from rest_framework.decorators import api_view
from rest_framework.response import Response

from shop.models import Product
from shop.serializers import ProductSerializer


class CustomProductPagination(CustomPagination):
    default_limit = 100
    max_limit = 100

    def get_paginated_response(self, data, **kwargs):
        return Response(OrderedDict([
            ('count', self.count),
            ('infos', kwargs.get('additional_infos')),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data)
        ]))


def products_filering_helper(request, queryset):
    # Since we receive the query as
    # [a,b,c], we need to split the
    # different elements
    def get_items(items) -> list:
        text = items[-1]
        tokens = text.split(',')
        return list(map(lambda x: x.title(), tokens))
    
    # If the incoming request contains
    # filters, filter the queryset
    sizes = request.GET.getlist('sizes', [])
    colors = request.GET.getlist('colors', [])
    # brand = request.GET.get('brand', [])
    # cut = request.GET.get('cut', [])
    # material = request.GET.get('material', [])
    # season = request.GET.get('season', [])
    # delivery = request.GET.get('season', False)
    # novelties = request.GET.get('novelties', False)
    return queryset.filter(
        Q(color__in=get_items(colors))
    )


def build_colors(colors):
    def build_color(name):
        return {'name': name, 'image': f"/media/{name.lower()}.png"}
    return map(build_color, colors)


@api_view(['get'])
def products_view(request, **kwargs):
    """Return all the products present on the website"""
    queryset = Product.objects.prefetch_related('additional_variants').filter(active=True)
    
    pagination_instance = CustomProductPagination()
    result = pagination_instance.paginate_queryset(queryset, request)
    
    serializer = ProductSerializer(data=result, many=True)
    serializer.is_valid()
    
    # Implement the filters that will be used
    # to filter the products on the collection page
    colors = queryset.order_by('color').distinct().values_list('color', flat=True)
    additional_infos = {
        'total_count':  queryset.count(),
        'filters': {
            'colors': list(build_colors(colors))
        }
    }
    return pagination_instance.get_paginated_response(serializer.data, additional_infos=additional_infos)


@api_view(['get'])
def search_view(request, **kwargs):
    """Search for items in the database"""
    search = request.GET.get('q')
    products = Product.objects.filter(
        Q(name__icontains=search) |
        Q(category__icontains=search) |
        Q(color__icontains=search)
    )
    return api_response(ProductSerializer, queryset=products, has_many=True)


@api_view(['get'])
def advanced_search_view(request, **kwargs):
    """Search for items in the database"""
    products = Product.objects.filter(active=True)
    queryset = products_filering_helper(request, products)
    serializer = ProductSerializer(instance=queryset, many=True)
    return_response = {
        'results': serializer.data
    }
    return api_response(data=return_response)

from api.utils import CustomProductPagination
from django.shortcuts import render
from rest_framework.decorators import api_view

from shop.models import Product
from shop.serializers import ProductSerializer


def filter_products(request, queryset):
    # If the incoming request contains
    # filters, filter the queryset
    size = request.GET.get('size', [])
    color = request.GET.get('color', [])
    brand = request.GET.get('brand', [])
    cut = request.GET.get('cut', [])
    material = request.GET.get('material', [])
    season = request.GET.get('season', [])
    delivery = request.GET.get('season', False)
    novelties = request.GET.get('novelties', False)
    return queryset


def build_colors(colors):
    def build_color(name):
        return {'name': name, 'image': f"/media/{name.lower()}.png"}
    return map(build_color, colors)


@api_view(['get'])
def products_view(request, **kwargs):
    """Return all the products present on the website"""
    queryset = Product.objects.prefetch_related('additional_variants').filter(active=True)
    queryset = filter_products(request, queryset)
    
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

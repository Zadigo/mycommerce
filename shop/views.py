from collections import OrderedDict

from django.db.models.expressions import Q
from django.shortcuts import get_object_or_404, render
from mycommerce.responses import CustomPagination, api_response
from rest_framework.decorators import api_view
from rest_framework.response import Response
from reviews.serializers import ReviewSerializer

from django.db.models import Avg    
import random
from shop.models import Product
from django.core.cache import cache
from shop.serializers import ProductSerializer, VariantSerializer


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


@api_view(['post'])
def product_details_view(request, pk, **kwargs):
    """Returns additional information on the product
    that is currently view
    
        * variants: products which carry the same name 
                    but have a different color variant
                    
        * reviews: the reviews on the current product
                   including the average rating 
    """
    product = get_object_or_404(Product, id=pk)
    products = Product.objects.filter(name__exact=product.name)
    variant_serializer = VariantSerializer(instance=products, many=True)
    
    reviews = cache.get(product.slug, None)
    if reviews is None:
        queryset = product.review_set.all()
        reviews_serializer = ReviewSerializer(instance=queryset, many=True)
        data = {'reviews': reviews_serializer.data}
        data = data | queryset.aggregate(average_rating=Avg('rating'))
        cache.set(product.name, data, 1)
        reviews = data
        
    recommended_products = Product.objects.filter(name__contains=product.name).exclude(id=product.id)
    recommended_products_serializer = ProductSerializer(
        # instance=random.choices(recommended_products, k=4),
        instance=recommended_products[:4],
        many=True
    )

    return_response = {
        'variants': variant_serializer.data,
        'recommended_products': recommended_products_serializer.data,
        **reviews
    }
    
    return api_response(data=return_response)

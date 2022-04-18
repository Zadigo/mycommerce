import random
from collections import OrderedDict
from hashlib import md5

from django.core.cache import cache
from django.db.models import Avg
from django.db.models.expressions import Q
from django.shortcuts import get_list_or_404, get_object_or_404
from mycommerce.choices import flatten_choices
from mycommerce.responses import (CustomPagination, api_response,
                                  error_response, simple_api_response)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from reviews.serializers import ReviewSerializer

from shop.choices import CategoryChoices
from shop.models import Like, Product, Wishlist
from shop.serializers import (ImageAssociationSerializer, LikeSerializer,
                              ProductSerializer, ProductUpdateValidation,
                              ValidateWishList, VariantSerializer,
                              WishlistSerializer)


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
    queryset = cache.get('products', None)
    if queryset is None:
        queryset = Product.objects.filter(active=True)
        cache.set('products', queryset, timeout=10)
    
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
    """Advanced search for colors, variants..."""
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
    
    products = Product.objects.all()
    product_variants = products.filter(name__exact=product.name)
    variant_serializer = VariantSerializer(instance=product_variants, many=True)
    
    cache_key = md5(product.slug.encode('utf-8')).hexdigest()
    
    reviews = cache.get(cache_key, None)
    if reviews is None:
        queryset = product.review_set.all()
        reviews_serializer = ReviewSerializer(instance=queryset, many=True)
        data = {'reviews': reviews_serializer.data}
        data = data | queryset.aggregate(average_rating=Avg('rating'))
        cache.set(cache_key, data, 3600)
        reviews = data
    
    recommended_products = products.filter(name__icontains=product.name).exclude(id=product.id)
    
    if len(recommended_products) <= 3:
        other_products = products.exclude(id=product.id)
        
        recommended_products_serializer = ProductSerializer(
            instance=random.choices(other_products, k=4),
            many=True
        )
    else:
        recommended_products_serializer = ProductSerializer(
            instance=recommended_products[:4],
            many=True
        )

    return_response = {
        'variants': variant_serializer.data,
        'recommended_products': recommended_products_serializer.data,
        **reviews
    }
    
    return api_response(data=return_response)


@api_view(['post'])
@permission_classes([IsAuthenticated])
def create_whishlist_view(request, **kwargs):
    """Create a whishlist"""
    serializer = ValidateWishList(data=request.data)
    serializer.is_valid(raise_exception=True)
    new_serializer = serializer.save(request)
    return simple_api_response(new_serializer)


@api_view(['get'])
@permission_classes([IsAuthenticated])
def whishlist_details_view(request, pk, **kwargs):
    """Get a specific whishlist"""
    wishlist = get_object_or_404(Wishlist, id=pk)
    serializer = WishlistSerializer(instance=wishlist)
    return api_response(serializer)


@api_view(['post'])
@permission_classes([IsAuthenticated])
def add_to_list_view(request, pk, **kwargs):
    """Get a specific whishlist"""
    wishlist = get_object_or_404(Wishlist, pk=pk)
    product = get_object_or_404(Product, id=request.data.get('product', None))
    
    if not product.active:
        return simple_api_response({'state': False, 'message': 'Not active'})
    
    products = wishlist.products.filter(id=product.id)
    if products.exists():
        return simple_api_response({'state': False, 'message': 'Already liked'})
    else:
        wishlist.products.add(product)
        serializer = WishlistSerializer(instance=wishlist)
        return simple_api_response(serializer)


@api_view(['post'])
@permission_classes([IsAuthenticated])
def remove_from_list_view(request, pk, **kwargs):
    """Get a specific whishlist"""
    wishlist = get_object_or_404(Wishlist, pk=pk)
    product = get_object_or_404(Product, id=request.data.get('product', None))
    wishlist.products.remove(product)
    serializer = WishlistSerializer(instance=wishlist)
    return simple_api_response(serializer)


@api_view(['get'])
@permission_classes([IsAuthenticated])
def list_whishlists_view(request, **kwargs):
    """Get all the user's whishlists"""
    whishlist = get_list_or_404(Wishlist, user=request.user)
    serializer = WishlistSerializer(instance=whishlist, many=True)
    return simple_api_response(serializer)


@api_view(['get'])
@permission_classes([])
def dashboard_product_view(request, pk, **kwargs):
    """Get additional details of a given product"""
    product = get_object_or_404(Product, id=pk)
    serializer = ProductSerializer(instance=product)
    return simple_api_response(serializer)


@api_view(['post'])
@permission_classes([IsAuthenticated])
def like_product_view(request, pk, **kwargs):
    """Add a product to the like list"""
    product = get_object_or_404(Product, id=pk)
    # Check whether the user has already liked
    # the product
    queryset = product.like_set.filter(user=request.user)

    response_data = {'status': False}
    
    if not queryset.exists():
        instance, state = Like.objects.get_or_create(user=request.user)
        instance.products.add(product)
        response_data['status'] = True
        serializer = ProductSerializer(instance=instance.products.all(), many=True)
        response_data['result'] = serializer.data
    return simple_api_response(response_data)


@api_view(['get'])
@permission_classes([IsAuthenticated])
def liked_products_view(request, **kwargs):
    """Return all the products liked by a given user"""
    like_list = get_object_or_404(Like, user=request.user)
    return api_response(LikeSerializer, queryset=like_list)


@api_view(['post'])
@permission_classes([IsAuthenticated])
def remove_liked_product_view(request, **kwargs):
    """Return all the products liked by a given user"""
    like_list = get_object_or_404(Like, user=request.user)
    product = request.data.get('product', None)
    if not product:
        return error_response()
    product = get_object_or_404(Product, id=product)
    like_list.products.remove(product)
    # TODO: Make this the regular return way for all like
    # functions that require this
    return api_response(ProductSerializer, queryset=like_list.products.all(), has_many=True)


# Dashboard

@api_view(['get'])
def generic_products_view(request, **kwargs):
    products = cache.get('generic_product_details')
    if not products:
        products = Product.objects.values('id', 'name')
        cache.get('generic_product_details', products, 3600)
    return simple_api_response(products)


@api_view(['get'])
def dashboard_product_details_view(request, pk, **kwargs):
    product = get_object_or_404(Product, pk=pk)
    serializer = ProductSerializer(instance=product)
    return simple_api_response(serializer)


@api_view(['post'])
def associate_images_to_product(request, pk, **kwargs):
    """Associate images to a given product"""
    serializer = ImageAssociationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save(pk)
    return simple_api_response({'status': True})


@api_view(['post'])
def rename_products_view(request, **kwargs):
    serializer = RenamProductsValidation(data=request.data)
    serializer.is_valid(raise_exception=True)
    products = serializer.save()
    products_serializer = ProductSerializer(instance=products, many=True)
    return responses.success_response(serializer=products_serializer)


@api_view(['get'])
def products_view(request, **kwargs):
    queryset = Product.objects.values('id', 'name', 'active')
    serializer = ProductSerializer(instance=queryset, many=True)
    return responses.success_response(serializer=serializer)


@api_view(['post'])
def update_product_view(request, pk, **kwargs):
    product = get_object_or_404(Product, id=pk)
    serializer = ProductUpdateValidation(instance=product, data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return simple_api_response(serializer)


@api_view(['get'])
def query_categories(request, **kwargs):
    categories = cache.get('categories', None)
    if categories is None:
        categories = map(lambda x: x[-1], CategoryChoices.choices)
        cache.set('categories', list(categories), 3600)
    return simple_api_response(categories)

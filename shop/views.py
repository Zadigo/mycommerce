import datetime
import random
from collections import OrderedDict
from hashlib import md5

import pytz
from cart.models import Cart
from django.core.cache import cache
from django.db.models import Avg
from django.db.models.aggregates import Count
from django.db.models.expressions import Q
from django.shortcuts import get_list_or_404, get_object_or_404
from django.utils.timezone import make_aware, now
from mycommerce.choices import flatten_choices
from mycommerce.responses import (CustomPagination, api_response,
                                  error_response, simple_api_response)
from orders.models import CustomerOrder
from rest_framework.decorators import api_view, permission_classes
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from reviews.serializers import ReviewSerializer

from shop.choices import CategoryChoices
from shop.helpers import (CustomPagination, build_colors,
                          products_filering_helper)
from shop.models import Image, Like, Product, Wishlist
from shop.serializers import (DashboardImageSerializer,
                              ImageAssociationSerializer, LikeSerializer,
                              ProductSerializer, ProductUpdateValidation,
                              ValidateWishList, VariantSerializer,
                              WishlistSerializer)


@api_view(['get'])
def products_view(request, **kwargs):
    """Return all the products present on the website"""
    queryset = cache.get('products', None)
    if queryset is None:
        queryset = Product.objects.filter(active=True)
        cache.set('products', queryset, timeout=10)

    total_product_count = queryset.count()

    pagination_instance = CustomPagination()
    result = pagination_instance.paginate_queryset(queryset, request)

    # We're passing the paginated data through the
    # serializer and need to call is_valid still
    serializer = ProductSerializer(data=result, many=True)
    serializer.is_valid()

    # Implement the filters that will be used
    # to filter the products on the collection page
    colors = queryset.order_by(
        'color').distinct().values_list('color', flat=True)
    additional_infos = {
        'total_count':  queryset.count(),
        'filters': {
            'colors': list(build_colors(colors))
        }
    }
    return pagination_instance.get_paginated_response(
        serializer.data,
        total_count=total_product_count,
        additional_infos=additional_infos
    )


@api_view(['get'])
def search_view(request, **kwargs):
    """Search for items in the database"""
    search = request.GET.get('q')
    products = Product.objects.filter(
        Q(name__icontains=search) |
        Q(category__icontains=search) |
        Q(color__icontains=search),
        active=True
    )
    return api_response(ProductSerializer, queryset=products, has_many=True)


@api_view(['get'])
def advanced_search_view(request, **kwargs):
    """Advanced search for colors, variants..."""
    products = Product.objects.filter(active=True)
    queryset = products_filering_helper(request, products)
    serializer = ProductSerializer(instance=queryset, many=True)
    return_response = {'results': serializer.data}
    return api_response(data=return_response)


@api_view(['post'])
def product_details_view(request, pk, **kwargs):
    """
    Returns additional information of the current product
    that was initially partially retrieved on
    the products page

        * variants: products which carry the same name 
                    but have a different color variant

        * reviews: the reviews on the current product
                   including the average rating 
    """
    product = get_object_or_404(Product, id=pk)

    # 1. This section gets and return exactly the same
    # product but with a different variant
    products = Product.objects.filter(active=True)
    variants = products.filter(name__exact=product.name)
    variant_serializer = VariantSerializer(instance=variants, many=True)

    # 2. Get the reviews on the given product and since
    # these does not change on a regular basis, cache
    cache_key = md5(product.slug.encode('utf-8')).hexdigest()

    reviews = cache.get(cache_key, None)
    if reviews is None:
        queryset = product.review_set.all()

        reviews_serializer = ReviewSerializer(instance=queryset, many=True)

        data = {'reviews': reviews_serializer.data}
        data = data | queryset.aggregate(average_rating=Avg('rating'))
        cache.set(cache_key, data, 3600)

        reviews = data

    # 3. Finally, get all the products that could be recommended
    # to the customer - use the current product information,
    # previous information from consulted products and likes
    if request.user.is_anonymous:
        recommended_products = products.filter(
            name__icontains=product.name).exclude(id=product.id)

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
    else:
        other_similar_products = products.filter(
            name__icontains=product.name).exclude(id=product.id)
        liked_products = products.filter(like__user=request.user)
        queryset = other_similar_products.union(liked_products)
        recommended_products_serializer = ProductSerializer(
            instance=queryset,
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
    """Creates a whishlist"""
    serializer = ValidateWishList(data=request.data)
    serializer.is_valid(raise_exception=True)
    wishlist_serializer = serializer.save(request)
    return simple_api_response(wishlist_serializer)


@api_view(['get'])
@permission_classes([IsAuthenticated])
def whishlist_details_view(request, pk, **kwargs):
    """Get a specific whishlist"""
    wishlist = get_object_or_404(Wishlist, id=pk)
    serializer = WishlistSerializer(instance=wishlist)
    return simple_api_response(serializer)


@api_view(['post'])
@permission_classes([IsAuthenticated])
def add_to_list_view(request, pk, **kwargs):
    """Adds a product to a given wishlist"""
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


@api_view(['post'])
@permission_classes([IsAuthenticated])
def like_product_view(request, pk, **kwargs):
    """Adds a product to the liked product's list"""
    product = get_object_or_404(Product, id=pk)
    queryset = product.like_set.filter(user=request.user)

    response_data = {'status': False}

    if not queryset.exists():
        instance, state = Like.objects.get_or_create(user=request.user)
        instance.products.add(product)

        response_data['status'] = True

        serializer = ProductSerializer(
            instance=instance.products.all(), many=True)
        response_data['result'] = serializer.data

    return simple_api_response(response_data)


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


@api_view(['get'])
@permission_classes([IsAuthenticated])
def liked_products_view(request, **kwargs):
    """Returns all the products liked by a given user"""
    like_list = get_object_or_404(Like, user=request.user)
    return api_response(LikeSerializer, queryset=like_list)


@api_view(['get'])
def latest_products(request, **kwargs):
    limit = request.GET.get('limit')
    if not limit:
        limit = 20

    if limit > 20:
        limit = 20

    limit = int(limit)

    queryset = cache.get('latest_products', None)

    if queryset is None:
        last_product = Product.objects.last()
        if last_product:
            fifteen_days_from_now = now() - datetime.timedelta(days=15)

            queryset = Product.objects.filter(
                Q(created_on__lte=fifteen_days_from_now.date()) &
                Q(created_on__gte=last_product.created_on),
                active=True
            ).order_by('-created_on')

            # In some case, if products are created on
            # the exact same day, then there cannot be
            # items between now and 15 days ago, this
            # solution resolves that
            if not queryset.exists():
                queryset = Product.objects.all()
                queryset = queryset[len(queryset)-limit:len(queryset)]
            else:
                queryset = queryset[:limit]
            print(queryset)
            cache.set('latest_products', queryset, 3600)

    serializer = ProductSerializer(instance=queryset, many=True)
    return simple_api_response(serializer.data)


# Dashboard

@api_view(['get'])
def generic_products_view(request, **kwargs):
    # products = cache.get('generic_product_details')
    # if not products:
    #     products = Product.objects.values('id', 'name')
    #     cache.get('generic_product_details', products, 3600)
    products = Product.objects.all()
    serializer = ProductSerializer(instance=products, many=True)
    return simple_api_response(serializer)


@api_view(['get'])
def dashboard_product_details_view(request, pk, **kwargs):
    product = get_object_or_404(Product, pk=pk)
    serializer = ProductSerializer(instance=product)
    return simple_api_response(serializer)


@api_view(['get'])
def images_view(request, **kwargs):
    queryset = Image.objects.all()
    serializer = DashboardImageSerializer(instance=queryset)
    paginator = CustomPagination()


@api_view(['post'])
def associate_images_to_product(request, pk, **kwargs):
    """Associate images to a given product"""
    serializer = ImageAssociationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    product_serializer = serializer.save(pk)
    return simple_api_response(product_serializer)


@api_view(['post'])
def dissociate_images_from_product(request, pk, **kwargs):
    """Associate images to a given product"""
    serializer = ImageAssociationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    product_serializer = serializer.remove(pk)
    return simple_api_response(product_serializer)


@api_view(['post'])
def rename_products_view(request, **kwargs):
    serializer = RenamProductsValidation(data=request.data)
    serializer.is_valid(raise_exception=True)
    products = serializer.save()
    products_serializer = ProductSerializer(instance=products, many=True)
    return responses.success_response(serializer=products_serializer)


# @api_view(['get'])
# def products_view(request, **kwargs):
#     queryset = Product.objects.values('id', 'name', 'active')
#     serializer = ProductSerializer(instance=queryset, many=True)
#     return responses.success_response(serializer=serializer)


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


@api_view(['get'])
@permission_classes([])
def dashboard_product_view(request, pk, **kwargs):
    """Get additional details of a given product"""
    product = get_object_or_404(Product, id=pk)
    serializer = ProductSerializer(instance=product)
    return simple_api_response(serializer)


@api_view(['post'])
def dashboard_toggle_product_state(request, method, **kwargs):
    product_ids = request.data.get('products', [])
    products = Product.objects.filter(id__in=product_ids)
    print(method)
    if method == 'activate':
        products.update(active=True)

    if method == 'deactivate':
        products.update(active=False)

    serializer = ProductSerializer(instance=products, many=True)
    return simple_api_response(serializer)


class ProductImagesView(GenericViewSet, ListModelMixin):
    queryset = Image.objects.all()
    serializer_class = DashboardImageSerializer
    permission_classes = []
    pagination_class = CustomPagination


@api_view(['get'])
def shop_statistics(request, **kwargs):
    customer_orders = CustomerOrder.objects.all()
    carts = Cart.objects.all()

    current_date = now()
    first = datetime.datetime(year=current_date.year,
                              month=current_date.month, day=1)

    months_logic = (
        Q(created_on__gte=make_aware(first)) &
        Q(created_on__lte=now())
    )

    customer_orders_for_month = customer_orders.filter(months_logic)

    total_customer_orders = customer_orders.aggregate(Count('id'))
    total_customer_orders_for_month = customer_orders_for_month.aggregate(
        Count('id'))

    customer_orders = {
        'total_count': total_customer_orders['id__count'],
        'month': total_customer_orders_for_month['id__count']
    }

    total_unpaid_carts = carts.aggregate(Count('id'))

    carts = {
        'total_count': total_unpaid_carts['id__count']
    }

    return_response = {
        'carts': carts,
        'customer_orders': customer_orders
    }
    return simple_api_response(return_response)

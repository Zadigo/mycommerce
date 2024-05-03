
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response

from shop.api import CustomPagination
from shop.api.serializers import admin as admin_serializers
from shop.api.serializers import shop as shop_serializers
from shop.models import Like, Product
from shop.serializers import ProductSerializer


@api_view(['get'])
def list_products(request, **kwargs):
    """Returns all the products that are
    present in the shop regardless of if
    they are active or not"""
    queryset = Product.objects.all()

    is_admin = request.GET.get('admin', False)

    serializer = None
    if is_admin == 'true':
        product_name = request.GET.get('name')
        if product_name:
            queryset = queryset.filter(name__icontains=product_name)

        serializer = admin_serializers.AdminProductSerializer(
            instance=queryset,
            many=True
        )
        return Response(serializer.data)
    else:
        paginator = CustomPagination()
        items = paginator.paginate_queryset(queryset, request)

        serializer = shop_serializers.ProductSerializer(
            data=items,
            many=True
        )
        serializer.is_valid()
        return paginator.get_paginated_response(serializer.data)


@api_view(['get'])
def get_product(request, pk, **kwargs):
    """Returns the details for a specific given 
    product present in the shop"""
    product = get_object_or_404(Product, pk=pk)
    variants = Product.objects.filter(name=product.name)

    is_admin = request.GET.get('admin', False)
    if is_admin == 'true':
        serializer = admin_serializers.AdminProductSerializer
    else:
        serializer = shop_serializers.ProductSerializer
    serializer = serializer(instance=product)

    data = serializer.data
    variants_serializer = shop_serializers.ColorVariantProductSerializer(
        instance=variants,
        many=True
    )
    data['variants'] = variants_serializer.data
    return Response(data)


@api_view(['get'])
def search_shop(request, **kwargs):
    search = request.GET.get('q', None)
    if search is None:
        return Response([])

    logic = (
        Q(name=search) |
        Q(name__icontains=search)
    )
    queryset = Product.objects.filter(logic)
    serializer = shop_serializers.ProductSerializer(
        instance=queryset,
        many=True
    )
    return Response(serializer.data)


@api_view(['get'])
def list_recommendations(request, **kwargs):
    quantity = request.GET.get('quantity', 20)
    queryset = Product.objects.all()[:quantity]
    serializer = ProductSerializer(
        instance=queryset,
        many=True
    )
    return Response(serializer.data)


@api_view(['post'])
def toggle_like(request, pk, **kwargs):
    product = get_object_or_404(Product, pk=pk)
    queryset = product.like_set.filter(product__id=pk)
    if queryset.exists():
        product.like_set.remove(product)
    else:
        product.like_set.create()
    queryset = Product.objects.filter(like__product__id=product.id)
    serializer = shop_serializers.ProductSerializer(
        instance=queryset,
        many=True
    )
    return Response(serializer.data)

# TODO: Put this in list_products


@api_view(['get'])
def search_shop(request, **kwargs):
    search = request.GET.get('q', None)
    if search is None:
        return Response([])

    logic = (
        Q(name=search) |
        Q(name__icontains=search)
    )
    queryset = Product.objects.filter(logic)
    serializer = shop_serializers.ProductSerializer(
        instance=queryset,
        many=True
    )
    return Response(serializer.data)

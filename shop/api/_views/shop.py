
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response

from shop.api import CustomPagination
from shop.api.serializers import admin as admin_serializers
from shop.api.serializers import shop as shop_serializers
from shop.models import Product
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

    is_admin = request.GET.get('admin', False)
    if is_admin == 'true':
        serializer = admin_serializers.AdminProductSerializer
    else:
        serializer = shop_serializers.ProductSerializer
    serializer = serializer(instance=product)
    return Response(serializer.data)


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

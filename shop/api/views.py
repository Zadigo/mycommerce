from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response

from shop.api import serializers
from shop.api.serializers import CustomPagination
from shop.models import Image, Product


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

        serializer = serializers.AdminProductSerializer(
            instance=queryset,
            many=True
        )
        return Response(serializer.data)
    else:
        paginator = CustomPagination()
        items = paginator.paginate_queryset(queryset, request)

        serializer = serializers.ProductSerializer(
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
        serializer = serializers.AdminProductSerializer
    else:
        serializer = serializers.ProductSerializer
    serializer = serializer(instance=product)
    return Response(serializer.data)


# ###### #
#  Admin #
# ###### #


@api_view(['get'])
def images(request, **kwargs):
    queryset = Image.objects.all()

    image_name = request.GET.get('name', None)
    if image_name is not None:
        queryset = queryset.filter(name__icontains=image_name)

    serializer = serializers.ImageProductSerializer(
        instance=queryset,
        many=True
    )
    return Response(serializer.data)


@api_view(['post'])
def filter_images(request, **kwargs):
    serializer = serializers.ValidateImageFiltersSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.filter_images()
    return Response(data)


@api_view(http_method_names=['post'])
def like_product_view(request, **kwargs):
    return Response({'state': True})

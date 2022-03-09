from django.shortcuts import get_object_or_404
from api.serializers.dashboard import (ImageAssociationSerializer,
                                       ImageSerializer, ProductSerializer, ProductUpdateValidation,
                                       RenamProductsValidation)
from api.utils import CustomPagination
from api.views import responses
from django.core.cache import cache
from rest_framework.decorators import api_view
from rest_framework.mixins import ListModelMixin
from rest_framework.viewsets import GenericViewSet
from shop.models import Image, Product


class ProductImagesView(GenericViewSet, ListModelMixin):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    permission_classes = []
    pagination_class = CustomPagination


@api_view(['get'])
def generic_product_details_view(request, **kwargs):
    products = cache.get('generic_product_details')
    if not products:
        products = Product.objects.values('id', 'name')
        cache.get('generic_product_details', products, 3600)
    return responses.success_response(data=products)


@api_view(['post'])
def associate_images_to_product(request, pk, **kwargs):
    """Associate images to a given product"""
    serializer = ImageAssociationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save(pk)
    return responses.success_response(serializer=serializer)


@api_view(['post'])
def rename_products_view(request, **kwargs):
    """Associate images to a given product"""
    serializer = RenamProductsValidation(data=request.data)
    serializer.is_valid(raise_exception=True)
    products = serializer.save()
    products_serializer = ProductSerializer(instance=products, many=True)
    return responses.success_response(serializer=products_serializer)


@api_view(['get'])
def products_view(request, **kwargs):
    """Associate images to a given product"""
    queryset = Product.objects.values('id', 'name', 'active')
    serializer = ProductSerializer(instance=queryset, many=True)
    return responses.success_response(serializer=serializer)


@api_view(['post'])
def update_product_view(request, pk, **kwargs):
    """Associate images to a given product"""
    product = get_object_or_404(Product, id=pk)
    serializer = ProductUpdateValidation(instance=product, data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return responses.success_response(serializer=serializer)

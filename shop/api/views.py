from rest_framework.decorators import api_view
from rest_framework.response import Response

from shop.api import serializers
from shop.models import Image, Product


@api_view(['get'])
def products(request, **kwargs):
    queryset = Product.objects.all()

    product_name = request.GET.get('name')
    if product_name:
        queryset = queryset.filter(name__icontains=product_name)

    serializer = serializers.ProductSerializer(
        instance=queryset,
        many=True
    )
    return Response(serializer.data)


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

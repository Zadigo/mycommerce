from mimetypes import guess_extension

from django.core.files.images import ImageFile
from django.core.validators import FileExtensionValidator
from django.db.models import CharField, Q, Value
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response

from shop.api import serializers
from shop.api.serializers import CustomPagination
from shop.models import Image, Product
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
    serializer = serializers.ProductSerializer(
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


# ###### #
#  Admin #
# ###### #


@api_view(['get'])
def list_images(request, **kwargs):
    queryset = Image.objects.all()

    image_name = request.GET.get('name', None)
    if image_name is not None:
        queryset = queryset.filter(name__icontains=image_name)

    serializer = serializers.ImageSerializer(
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


# Admin

@api_view(http_method_names=['post'])
def upload_images(request, **kwargs):
    # print(request.POST, request.data)
    names = request.data.getlist('name', [])
    files = request.data.getlist('files', [])

    association = []
    for i, name in enumerate(names):
        association.append((name, files[i]))

    validator = FileExtensionValidator(
        allowed_extensions=['jpg', 'jpeg', 'webp'])
    for item in association:
        file = item[1]

        extension = guess_extension(file.content_type)
        file_name = f'{item[0]}{extension}'

        image = ImageFile(file, name=file_name)
        validator(image)

        Image.objects.create(
            name=Value(item[0], output_field=CharField()),
            original=image
        )

    images = Image.objects.all()
    serializer = serializers.ImageSerializer(
        instance=images,
        many=True
    )
    return Response(serializer.data)


@api_view(http_method_names=['post'])
def associate_images(request, **kwargs):
    product = get_object_or_404(Product, pk=request.data['product'])
    serializer = serializers.ValidateImageAssociation(
        instance=product,
        data=request.data
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({'state': True})


@api_view(http_method_names=['post'])
def upload_images_to_product(request, pk, **kwargs):
    product = get_object_or_404(Product, pk=pk)

    names = request.data.getlist('name', [])
    files = request.data.getlist('files', [])

    association = []
    for i, name in enumerate(names):
        association.append((name, files[i]))

    validator = FileExtensionValidator(
        allowed_extensions=['jpg', 'jpeg', 'webp']
    )

    created_images = []
    for item in association:
        file = item[1]

        extension = guess_extension(file.content_type)
        file_name = f'{item[0]}{extension}'

        image = ImageFile(file, name=file_name)
        validator(image)

        new_image = Image.objects.create(
            name=Value(item[0], output_field=CharField()),
            original=image
        )
        created_images.append(new_image)

    product.images.add(*created_images)
    product.save()

    serializer = serializers.ImageSerializer(
        instance=product.images.all(),
        many=True
    )
    return Response(serializer.data)


@api_view(['post'])
def update_product(request, pk, **kwargs):
    product = get_object_or_404(Product, pk=pk)
    serializer = serializers.ValidateUpdateProduct(
        instance=product,
        data=request.data
    )
    serializer.is_valid(raise_exception=True)
    updated = serializer.save()

    print(updated.active)

    serializer = serializers.ProductSerializer(instance=updated)
    return Response(serializer.data)


@api_view(['post'])
def upload_products(request, **kwargs):
    serializer = serializers.ValidateFileUpload(data=request.data)
    serializer.is_valid(raise_exception=True)
    created_products = serializer.save()
    serializer = serializers.ProductSerializer(
        instance=created_products,
        many=True
    )
    return Response(serializer.data)

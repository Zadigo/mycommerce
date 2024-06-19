import datetime
from mimetypes import guess_extension

from django.core.files.images import ImageFile
from django.core.validators import FileExtensionValidator
from django.db.models import CharField, F, Q, Value
from django.db.models.aggregates import Avg, Count, Max, Min, StdDev, Variance
from django.db.models.expressions import Window
from django.db.models.functions import ExtractYear
from django.db.models.functions.window import Rank
from django.shortcuts import get_object_or_404
from django.utils.timezone import make_aware, now
from rest_framework.decorators import api_view
from rest_framework.response import Response

from cart.models import Cart
from mycommerce.utils import remove_accents
from orders.models import CustomerOrder
from shop.api.serializers import admin as admin_serializers
from shop.api.serializers import shop as shop_serializers
from shop.models import Image, Product


@api_view(['get'])
def list_images(request, **kwargs):
    queryset = Image.objects.all()

    image_name = request.GET.get('name', None)
    if image_name is not None:
        queryset = queryset.filter(name__icontains=image_name)

    serializer = admin_serializers.ImageSerializer(
        instance=queryset,
        many=True
    )
    return Response(serializer.data)


@api_view(http_method_names=['post'])
def upload_images(request, **kwargs):
    # print(request.POST, request.data)
    names = request.data.getlist('name', [])
    files = request.data.getlist('files', [])

    association = []
    for i, name in enumerate(names):
        association.append((name, files[i]))

    validator = FileExtensionValidator(
        allowed_extensions=['jpg', 'jpeg', 'webp']
    )
    for item in association:
        file = item[1]

        extension = guess_extension(file.content_type)
        clean_name = remove_accents(item[0])
        file_name = f'{clean_name}{extension}'

        image = ImageFile(file, name=file_name)
        validator(image)

        Image.objects.create(
            name=Value(item[0], output_field=CharField()),
            original=image
        )

    images = Image.objects.all()
    serializer = admin_serializers.ImageSerializer(
        instance=images,
        many=True
    )
    return Response(serializer.data)


@api_view(http_method_names=['post'])
def associate_images(request, **kwargs):
    product = get_object_or_404(Product, pk=request.data['product'])
    serializer = admin_serializers.ValidateImageAssociation(
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

    first_image = product.images.first()
    first_image.is_main_image = ~F('is_main_image')
    first_image.save()

    serializer = shop_serializers.ImageSerializer(
        instance=product.images.all(),
        many=True
    )
    return Response(serializer.data)


@api_view(['post'])
def update_product(request, pk, **kwargs):
    """Updates the different technical aspects
    of a given product in the database"""
    product = get_object_or_404(Product, pk=pk)
    serializer = admin_serializers.ValidateUpdateProduct(
        instance=product,
        data=request.data
    )
    serializer.is_valid(raise_exception=True)
    updated = serializer.save()

    serializer = shop_serializers.ProductSerializer(instance=updated)
    return Response(serializer.data)


@api_view(['post'])
def upload_products(request, **kwargs):
    """Upload a file containing a set of products
    to create in the database"""
    serializer = admin_serializers.ValidateFileUpload(data=request.data)
    serializer.is_valid(raise_exception=True)
    created_products = serializer.save()
    # TODO: Send this back to the user
    print(serializer._db_creation_errors)

    serializer = admin_serializers.AdminProductSerializer(
        instance=created_products,
        many=True
    )
    return Response(serializer.data)


@api_view(['post'])
def filter_images(request, **kwargs):
    serializer = admin_serializers.ValidateImageFiltersSerializer(
        data=request.data
    )
    serializer.is_valid(raise_exception=True)
    data = serializer.filter_images()
    return Response(data)


@api_view(['get'])
def calculate_shop_statistics(request, **kwargs):
    customer_orders = CustomerOrder.objects.annotate(
        current_year=ExtractYear('created_on')
    )
    carts = Cart.objects.all()

    statistics = {
        'total': {},
        'current_month': {}
    }

    current_date = now()
    first = datetime.datetime(
        year=current_date.year,
        month=current_date.month,
        day=1
    )

    customer_orders_for_month = customer_orders.filter(
        Q(created_on__gte=make_aware(first)) &
        Q(created_on__lte=now())
    )

    total_customer_orders = customer_orders.aggregate(
        Count('id'),
        Avg('price'),
        Max('price'),
        Min('price'),
        StdDev('price'),
        Variance('price')
    )
    statistics['total'].update(**total_customer_orders)

    total_customer_orders_for_month = customer_orders_for_month.aggregate(
        Count('id'),
        Avg('price'),
        Max('price'),
        Min('price'),
        StdDev('price'),
        Variance('price')
    )
    statistics['month'].update(**total_customer_orders_for_month)

    statistics_unpaid_cart = carts.aggregate(
        Count('id'),
        Avg('price'),
        Max('price'),
        Min('price'),
        StdDev('price'),
        Variance('price')
    )
    statistics.update(**statistics_unpaid_cart)

    top_selling_products = carts.annotate(top_selling=Window(
        Rank(),
        partition_by=F('product__id'),
        order_by='id'
    )
    )
    statistics['top_selling_products'] = top_selling_products
    return Response(statistics)


@api_view(['post'])
def toggle_product_state(request, method, **kwargs):
    product_ids = request.data.get('products', [])
    products = Product.objects.filter(id__in=product_ids)

    if method == 'activate':
        products.update(active=True)

    if method == 'deactivate':
        products.update(active=False)

    serializer = shop_serializers.ProductSerializer(
        instance=products, many=True)
    return Response(serializer.data)

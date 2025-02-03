from functools import lru_cache
import datetime
from collections import defaultdict
from mimetypes import guess_extension

from adminapi import serializers
from cart.models import Cart
from django.core.cache import cache
from django.core.files.images import ImageFile
from django.core.validators import FileExtensionValidator
from django.db.models import Case, CharField, F, Q, Value, When
from django.db.models.aggregates import (Avg, Count, Max, Min, StdDev, Sum,
                                         Variance)
from django.db.models.expressions import Window
from django.db.models.functions import ExtractMonth, ExtractYear
from django.db.models.functions.window import Rank
from django.shortcuts import get_object_or_404
from django.utils.timezone import make_aware, now
from orders.models import CustomerOrder
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from shop.models import Image, Product

from mystore.choices import CategoryChoices, SubCategoryChoices
from mystore.utils import remove_accents


class ListProducts(generics.ListAPIView):
    serializer_class = serializers.AdminProductSerializer
    queryset = Product.objects.all()
    permission_classes = []

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.GET.get('q')
        if search:
            logic = (
                Q(name__icontains=search) |
                Q(name=search)
            )
            return queryset.filter(logic)
        return queryset


class CreateProduct(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = serializers.NewProductSerializer
    permission_classes = []


class ListImages(generics.ListAPIView):
    serializer_class = serializers.ImageSerializer
    # permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = Image.objects.all()

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.GET.get('name')

        if search == '':
            return queryset

        if search is not None:
            return queryset.filter(name__icontains=search)

        return queryset


class ListCategories(generics.GenericAPIView):
    permission_classes = []

    def get(self, request, *args, **kwargs):
        values = []

        search = request.GET.get('q')

        if search == 'categories':
            values = cache.get('categories')
            if values is None:
                values = [x[0] for x in CategoryChoices.choices]
                cache.set('categories', values, timeout=6000)

        if search == 'subcategories':
            values = cache.get('subcategories')
            if values is None:
                values = SubCategoryChoices.flat()
                cache.set('subcategories', values, timeout=6000)

        return Response(values)


class UploadImages(generics.GenericAPIView):
    """Uploads images to the database without associating
    them to a given product"""

    serializer_class = serializers.ImageSerializer
    permission_classes = []

    def post(self, request, **kwargs):
        names = request.data.getlist('file_names', [])
        files = request.data.getlist('files', [])

        if not names:
            return Response([], status=status.HTTP_304_NOT_MODIFIED)

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
            clean_name = remove_accents(item[0])
            file_name = f'{clean_name}{extension}'

            image = ImageFile(file, name=file_name)
            validator(image)

            instance = Image.objects.create(
                name=item[0],
                original=image
            )
            created_images.append(instance)

        images = Image.objects.all()
        serializer = self.get_serializer(instance=created_images, many=True)
        return Response(serializer.data)


@api_view(http_method_names=['post'])
def upload_images(request, **kwargs):
    names = request.data.getlist('file_names', [])
    files = request.data.getlist('files', [])

    if not names:
        return Response([], status=status.HTTP_304_NOT_MODIFIED)

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
            name=item[0],
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


class UploadImagesToProduct(generics.GenericAPIView):
    queryset = Image.objects.all()
    serializer_class = serializers.ImageSerializer
    permission_classes = []

    def post(self, request, pk, **kwargs):
        product = get_object_or_404(Product, pk=pk)

        names = request.data.getlist('file_names', [])
        files = request.data.getlist('files', [])

        association = []
        for i, name in enumerate(names):
            association.append((name, files[i]))

        validator = FileExtensionValidator(
            allowed_extensions=['jpg', 'jpeg', 'webp']
        )

        if association:
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

            serializer = self.get_serializer(
                instance=product.images.all(), many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({}, status=status.HTTP_204_NO_CONTENT)


class GetProduct(generics.RetrieveUpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = serializers.ProductSerializer
    permission_classes = []


@api_view(['post'])
def update_product(request, pk, **kwargs):
    """Updates the different technical aspects
    of a given product in the database"""
    product = get_object_or_404(Product, pk=pk)
    serializer = serializers.ValidateUpdateProduct(
        instance=product,
        data=request.data
    )
    serializer.is_valid(raise_exception=True)
    updated = serializer.save()

    serializer = serializers.ProductSerializer(instance=updated)
    return Response(serializer.data)


@api_view(['post'])
def upload_products(request, **kwargs):
    """Upload a file containing a set of products
    to create in the database"""
    serializer = serializers.ValidateFileUpload(data=request.data)
    serializer.is_valid(raise_exception=True)
    created_products = serializer.save()
    # TODO: Send this back to the user
    print(serializer._db_creation_errors)

    serializer = serializers.AdminProductSerializer(
        instance=created_products,
        many=True
    )
    return Response(serializer.data)


@api_view(['post'])
def filter_images(request, **kwargs):
    serializer = serializers.ValidateImageFiltersSerializer(
        data=request.data
    )
    serializer.is_valid(raise_exception=True)
    data = serializer.filter_images()
    return Response(data)


class CalculateShopStatistics(generics.GenericAPIView):
    permission_classes = []

    def customer_orders(self):
        customer_orders = CustomerOrder.objects.annotate(
            current_year=ExtractYear('created_on')
        )
        carts = Cart.objects.all()

        statistics = {
            'total': {},
            'month': {},
            'current_month': {}
        }

        current_date = now()
        first = datetime.datetime(
            year=current_date.year,
            month=current_date.month,
            day=1
        )

        total_customer_orders = customer_orders.aggregate(
            Count('id'),
            Avg('total'),
            Max('total'),
            Min('total'),
            StdDev('total'),
            Variance('total')
        )
        statistics['total'].update(**total_customer_orders)

        customer_orders_for_month = customer_orders.filter(
            Q(created_on__gte=make_aware(first)) &
            Q(created_on__lte=now())
        )

        total_customer_orders_for_month = customer_orders_for_month.aggregate(
            Count('id'),
            Avg('total'),
            Max('total'),
            Min('total'),
            StdDev('total'),
            Variance('total')
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

        top_selling_products = carts.annotate(selling_rank=Window(
            Rank(),
            partition_by=F('product__id'),
            order_by='id'
        )
        )
        statistics['top_selling_products'] = top_selling_products.values(
            'id',
            'product__name',
            'selling_rank'
        )
        return statistics

    def products(self):
        qs = Product.objects.all()

        statistics = {}

        total_products = qs.aggregate(
            Count('id'),
            Avg('unit_price'),
            Min('unit_price'),
            Max('unit_price')
        )
        statistics['global'] = total_products

        products_on_sale = qs.filter(on_sale=True)
        statistics['products_on_sale'] = products_on_sale.count()
        return statistics

    def get(self, request, **kwargs):
        template = defaultdict(dict)
        template['orders'] = self.customer_orders()
        template['products'] = self.products()
        return Response(template)


@api_view(['post'])
def toggle_product_state(request, method, **kwargs):
    product_ids = request.data.get('products', [])
    products = Product.objects.filter(id__in=product_ids)

    if method == 'activate':
        products.update(active=True)

    if method == 'deactivate':
        products.update(active=False)

    serializer = serializers.ProductSerializer(
        instance=products, many=True)
    return Response(serializer.data)


class CartStatistics(APIView):
    def get(self, requet, *args, **kwargs):
        revenue_per_month = Cart.objects.annotate(month=ExtractMonth(
            'created_on')).values('month').annotate(c=Sum('price'))

        popular_products = Product.objects.annotate(xprice=Window(
            expression=Rank(), order_by=F('unit_price').asc())).values('xprice')

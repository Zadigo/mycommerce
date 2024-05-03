import spacy
import pandas
import random
from django.db.models import Q, When, Case
from django.db.models.functions.window import Rank
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

    search = request.GET.get('q', None)
    if search is not None:
        logic = (
            Q(name=search) |
            Q(name__icontains=search)
        )
        queryset = queryset.filter(logic)

    colors = request.GET.getlist('colors', None)
    if colors is not None:
        queryset = queryset.filter(color__in=colors)

    min_price = request.GET.get('min_price', None)
    max_price = request.GET.get('max_price', None)
    if min_price is not None:
        condition = When(condition=Q(on_sale=True), then='sale_price')
        case = Case(*[condition], default='unit_price')

        annotated_price = queryset.annotate(true_price=case)
        queryset = annotated_price.filter(true_price__gte=min_price)

        if max_price is not None:
            queryset = queryset.filter(true_price__lte=max_price)

    sizes = request.GET.getlist('sizes', [])
    if sizes:
        queryset = queryset.filter(size__name__in=sizes)

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
    testing = request.GET.get('t', None)
    product_id = request.GET.get('q')
    quantity = request.GET.get('quantity', 30)

    try:
        quantity = int(quantity)
    except:
        return Response([], status=400)

    product = get_object_or_404(Product, pk=product_id)
    products = Product.objects.exclude(id=product.id)
    product_values = products.values('id', 'name')

    # TODO: For testing purposes
    if testing is not None:
        if testing == 'true':
            serializer = ProductSerializer(
                instance=products[:quantity],
                many=True
            )
            return Response(serializer.data)

    df = pandas.DataFrame(product_values)

    try:
        # calculator = spacy.load('en_core_web_md')
        calculator = spacy.load('fr_core_news_md')
    except Exception as e:
        print(e)
        return Response([], status=400)

    for product in df.itertuples(name='Product'):
        result = calculator(product.name).similarity(calculator(product.name))
        df.loc[product.Index, 'similarity'] = result

    df = df.sort_values('similarity')
    df = df.loc[lambda x: x.similarity > 0.8]

    print(df)

    selected_items = random.choices(df.id.to_list(), k=quantity)
    queryset = Product.objects.filter(id__in=selected_items)

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

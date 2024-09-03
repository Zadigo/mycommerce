import random

import pandas
import spacy
from django.core.cache import cache
from django.db.models import Case, Q, When
from django.db.models.functions.window import Rank
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.mixins import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from shop.api import CustomPagination
from shop.api.serializers import admin as admin_serializers
from shop.api.serializers import shop as shop_serializers
from shop.api.serializers.shop import ProductSerializer
from shop.models import Product
from drf_spectacular.utils import extend_schema


@extend_schema('List Products')
class ListProducts(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        queryset = self.queryset.filter(active=True)

        search = self.request.GET.get('q')
        if search is not None:
            logic = (
                Q(name=search) |
                Q(name__icontains=search)
            )
            queryset = queryset.filter(logic)

        colors = self.request.GET.getlist('colors')
        if colors:
            queryset = queryset.filter(color__in=colors)

        min_price = self.request.GET.get('min_price')
        max_price = self.request.GET.get('max_price')
        if min_price is not None:
            condition = When(condition=Q(on_sale=True), then='sale_price')
            case = Case(*[condition], default='unit_price')

            annotated_price = queryset.annotate(true_price=case)
            queryset = annotated_price.filter(true_price__gte=min_price)

            if max_price is not None:
                queryset = queryset.filter(true_price__lte=max_price)

        sizes = self.request.GET.getlist('sizes', [])
        if sizes:
            queryset = queryset.filter(size__name__in=sizes)

        is_admin = self.request.GET.get('admin')
        if is_admin == 'true':
            product_name = self.request.GET.get('name')
            if product_name:
                queryset = queryset.filter(name__icontains=product_name)

            self.serializer_class = admin_serializers.AdminProductSerializer
        return queryset


@extend_schema('Get Product')
class GetProduct(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    http_method_names = ['get']

    def retrieve(self, request, *args, **kwargs):
        product = self.get_object()
        serializer = self.get_serializer(product)

        variants = Product.objects.filter(name=product.name)
        variants_serializer = shop_serializers.ColorVariantProductSerializer(
            instance=variants,
            many=True
        )
        data = serializer.data
        data['variants'] = variants_serializer.data
        return Response(data)


@extend_schema('Get Recommendations')
class ListRecommendations(ListAPIView):
    """This endpoint allows the pages that require displaying
    a set of recommended products to be called by passing a
    quantity of items to be displayed. Recommandations can be
    filtered using either a `collection_name` or a `product_id`"""

    http_method_names = ['get']
    queryset = Product.objects.filter(active=True)
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def recommendation_by_randomness(self, products, quantity):
        selected_items = []
        for _ in range(quantity):
            selected_items.append(random.choice(products))
        return selected_items

    def recommendation_by_similarity(self, queryset, products, initial_product, quantity):
        product_values = products.values('id', 'name')

        df = pandas.DataFrame(product_values)

        try:
            calculator = spacy.load('fr_core_news_md')
        except Exception as e:
            # Instead of failing hard, just return
            # the first set of available products
            # to the frontend
            return products[:quantity]

        for item in df.itertuples(name='Product'):
            product_instance = calculator(initial_product.name)
            result = calculator(item.name).similarity(product_instance)
            df.loc[item.Index, 'similarity'] = result

        df = df.sort_values('similarity')
        high_similarity = df.loc[lambda x: x.similarity > 0.8]

        selected_items = random.choices(
            high_similarity.id.to_list(), 
            k=quantity
        )
        return queryset.filter(id__in=selected_items)

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            instance=self.get_queryset(), 
            many=True
        )
        return Response(serializer.data)

    def get_queryset(self):
        """Allows us to get similar products from the database
        using the spacy if a `product_id` is provided by the
        frontend. In the case where we have a collection name,
        we can return random items from said collection who
        have a high popularity in the shop"""
        product_id_or_collection_name = self.request.GET.get('p')
        quantity = self.request.GET.get('q', 30)

        if product_id_or_collection_name is None:
            return []

        is_integer = all([
            product_id_or_collection_name.isnumeric(),
            product_id_or_collection_name.isdigit(),
        ])

        queryset = super().get_queryset()

        if is_integer:
            product_id_or_collection_name = int(product_id_or_collection_name)

        try:
            quantity = int(quantity)
        except:
            return Response([], status=status.HTTP_400_BAD_REQUEST)

        if is_integer:
            initial_product = get_object_or_404(
                Product,
                pk=product_id_or_collection_name
            )
            products = self.queryset.exclude(id=initial_product.id)
            return self.recommendation_by_randomness(products, quantity)
            # return self.recommendation_by_similarity(queryset, products, initial_product, quantity)
        else:
            products = self.queryset.filter(
                collection__name=product_id_or_collection_name
            )
            return products[:quantity]


@extend_schema('Search')
class SearchShop(ListAPIView):
    """Enpoint that allows the user to search
    products in the shop by name"""

    http_method_names = ['get']
    serializer_class = ProductSerializer
    queryset = Product.objects.filter(active=True)
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            instance=self.get_queryset(), many=True)
        return Response(serializer.data)

    def get_queryset(self):
        queryset = super().get_queryset()

        search = self.request.GET.get('q', None)
        if search is None:
            return []

        logic = (
            Q(name=search) |
            Q(name__icontains=search)
        )
        return queryset.filter(logic)

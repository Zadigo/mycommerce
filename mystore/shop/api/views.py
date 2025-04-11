import json
import random

import pandas
from django.core.cache import cache
from django.db.models import Case, Q, When
from django.db.models.functions.text import Concat
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.mixins import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from shop.api import CustomPagination, serializers
from shop.models import Novelty, Product, Sale
from shop.processors import FuzzyMatcherMixin


class ListProducts(generics.ListAPIView):
    """List the products in the database and accepts
    a set of query parameters that can be used to
    filter the elements by type:

    * `q` - Searches the products by name
    * `colors` - Filters the prodcuts by color
    * `min_price` - `max_price` - Returns the products between
      the selected price range
    * `sizes` - Filters the products by a given size
    """

    queryset = Product.objects.all()
    serializer_class = serializers.ProductSerializer
    pagination_class = CustomPagination
    permission_classes = [AllowAny]

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
        return queryset


class GetProduct(generics.RetrieveAPIView):
    """Returns a specific product from the database"""

    queryset = Product.objects.all()
    serializer_class = serializers.ProductSerializer

    def retrieve(self, request, *args, **kwargs):
        product = self.get_object()
        serializer = self.get_serializer(product)

        variants = Product.objects.filter(name=product.name)
        variants_serializer = serializers.ColorVariantProductSerializer(
            instance=variants,
            many=True
        )
        data = serializer.data
        data['variants'] = variants_serializer.data
        return Response(data)


class ListRecommendations(generics.ListAPIView):
    """This endpoint allows the pages that require displaying
    a set of recommended products to be called by passing a
    quantity of items to be displayed. Recommendations are
    based on the caracteristics of the product that is currently
    visited. For example if you're visiting skirts then the
    recommended products will be related to that category

    * `p` - Return products from a specific collection name or
      in the same product range as the one currently visited
    * `q` - Quantity of products to return
    * `for_mobile` - On mobile phones, the home page recommends
      products that are not necessarily related to a visited product
      this indicates to return a random set of items
    """

    queryset = Product.objects.filter(active=True)
    serializer_class = serializers.ProductSerializer
    permission_classes = [AllowAny]

    def recommendation_by_randomness(self, products, quantity):
        if len(products) == 0:
            return []

        selected_items = set()
        for _ in range(int(quantity)):
            selected_items.add(random.choice(products))
        return selected_items

    def recommendation_by_fuzinness(self, product, queryset):
        """Function that returns a set of products that a closely
        related from a linguistic perpsective to the product provided
        within the function for example: Jupe Verte will be recommended
        for a product whose name is Jupe Grande Marron"""
        results = []
        matcher = FuzzyMatcherMixin()

        for item in queryset:
            result = matcher.get_match_details(
                product.name,
                item.color_variant_name
            )

            result['product'] = item.id
            results.append(result)

        df = pandas.DataFrame(results)
        df = df.sort_values('weighted_ratio')
        df = df[df['weighted_ratio'] >= 0.5]

        ids = df['product'].to_list()
        return queryset.filter(id__in=ids).exclude(id=product.id)

    def recommendation_by_novelties(self, quantity):
        novelties = cache.get('novelties', None)
        if novelties is None:
            novelties = Novelty.objects.all()
            if not novelties.exists():
                novelties = Product.objects.order_by('-created_on')
            cache.set('novelties', novelties, timeout=1)

        if isinstance(quantity, str):
            quantity = int(quantity)

        sliced_novelties = []
        if novelties.count() >= quantity:
            sliced_novelties = novelties[:quantity]
        else:
            sliced_novelties = novelties
        return sliced_novelties

    def get_queryset(self):
        """Allows us to get similar products from the database
        using spacy if a `product_id` is provided by the
        frontend. In the case where we have a collection name,
        we can return random items from said collection who
        have a high popularity in the shop"""
        product_id_or_collection_name = self.request.GET.get('p')
        quantity = self.request.GET.get('q', 30)
        for_mobile = self.request.GET.get('m', 0)
        with_images = self.request.GET.get('i', 0)

        # TODO: Use a cached version of products

        # A set of previously liked products can also be
        # passed in, in order to generate recommended products
        # liked_products = self.request.GET.getlist('l')

        if for_mobile == '1':
            queryset = super().get_queryset()
            if with_images == '1':
                logic = When(Q(images=None), False)
                case = Case(logic, default=True)
                queryset = queryset.annotate(
                    has_images=case).filter(has_images=True)
            return self.recommendation_by_randomness(queryset, quantity)

        # By default, return the last products that
        # where created in the database
        if product_id_or_collection_name is None:
            return self.recommendation_by_novelties(quantity)

        queryset = super().get_queryset()

        is_integer = all([
            product_id_or_collection_name.isnumeric(),
            product_id_or_collection_name.isdigit(),
        ])

        if is_integer:
            product_id_or_collection_name = int(product_id_or_collection_name)

        try:
            quantity = int(quantity)
        except:
            return Response([], status=status.HTTP_400_BAD_REQUEST)

        if is_integer:
            initial_product = get_object_or_404(
                queryset,
                pk=product_id_or_collection_name
            )
            return self.recommendation_by_fuzinness(initial_product, queryset)
            # products = self.queryset.exclude(id=initial_product.id)
            # return self.recommendation_by_randomness(products, quantity)
        return self.recommendation_by_novelties(quantity)


class ListNewProducts(generics.ListAPIView):
    """Endpoint that returns products that are marked
    as new, in other words, that were created in a
    given timeframe or who have `display_new` set to True"""

    queryset = Novelty.objects.filter(active=True)
    serializer_class = serializers.ProductSerializer
    pagination_class = CustomPagination
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = cache.get('novelties', None)
        if qs is None:
            qs = super().get_queryset()
            cache.set('novelties', qs, timeout=1)
        return qs


class ListProductsOnSale(generics.ListAPIView):
    """Endpoint that returns products that were marked
    as being on sale. Both `sale_value` and `on_sale` have
    to be True in order to return the product"""

    queryset = Sale.objects.filter(active=True)
    serializer_class = serializers.ProductSerializer
    pagination_class = CustomPagination
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = cache.get('sales', None)
        if qs is None:
            qs = super().get_queryset()
            cache.set('sales', qs, timeout=1)
        return qs


@api_view(http_method_names=['get'])
def test_fuzzy(request, **kwargs):
    results = []
    search = request.GET.get('s')
    qs = Product.objects.all()
    instance = FuzzyMatcherMixin()
    for item in qs:
        result = instance.get_match_details(search, item.color_variant_name)
        result['product'] = item.id
        results.append(result)
    df = pandas.DataFrame(results)
    df = df[df['weighted_ratio'] >= 0.7]

    ids = df['product'].to_list()
    selected_products = qs.filter(id__in=ids)
    # data = json.loads(df.to_json(orient='records'))
    # return Response(data)
    serializer = serializers.ProductSerializer(
        instance=selected_products, many=True)
    return Response(serializer.data)

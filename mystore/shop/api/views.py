import random

import pandas
# import spacy
from django.db.models import Case, Q, When
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.mixins import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from shop.api import CustomPagination, serializers
from shop.models import Product


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

    def get_queryset(self):
        """Allows us to get similar products from the database
        using the spacy if a `product_id` is provided by the
        frontend. In the case where we have a collection name,
        we can return random items from said collection who
        have a high popularity in the shop"""
        product_id_or_collection_name = self.request.GET.get('p')
        quantity = self.request.GET.get('q', 30)
        for_mobile = self.request.GET.get('m', 0)
        with_images = self.request.GET.get('i', 0)
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
        else:
            print('product_id_or_collection_name',
                  product_id_or_collection_name)
            if not product_id_or_collection_name:
                return self.recommendation_by_randomness(queryset, quantity)
            else:
                products = queryset.filter(
                    collection__name=product_id_or_collection_name
                )
                return products[:quantity]


class LikedProductsView(generics.ListAPIView):
    serializer_class = serializers.LikeSerializer
    queryset = Product.objects.all()
    permission_classes = [AllowAny]
    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()

        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        ids = serializer.validated_data['product_ids']
        queryset = queryset.filter(id__in=ids)

        if self.request.user.is_authenticated:
            pass

        return queryset

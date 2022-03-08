from api.serializers.products import (LikeSerializer, ProductSerializer, SimpleProductVariantSerializer, ValidateAddToList, ValidateWishList,
                                      WishlistSerializer)
from api.serializers.reviews import ReviewSerializer
from api.utils import CustomImageProcessor, CustomPagination, get_product_model
from api.views.responses import success_response
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.mixins import (CreateModelMixin, DestroyModelMixin,
                                   ListModelMixin, RetrieveModelMixin,
                                   UpdateModelMixin)
from rest_framework.permissions import DjangoObjectPermissions, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from shop.models import Like, Product, Wishlist

PRODUCT_MODEL = get_product_model()


def process_image(image):
    source_file = open('/path/to/myimage.jpg')
    image_generator = CustomImageProcessor(source=source_file)
    return image_generator.generate()


def filter_products(request, queryset):
    # If the incoming request contains
    # filters, filter the queryset
    size = request.GET.get('size', [])
    color = request.GET.get('color', [])
    brand = request.GET.get('brand', [])
    cut = request.GET.get('cut', [])
    material = request.GET.get('material', [])
    season = request.GET.get('season', [])
    delivery = request.GET.get('season', False)
    novelties = request.GET.get('novelties', False)
    return queryset


@api_view(['get'])
def products_view(request, **kwargs):
    """Return all the products present on the website"""
    queryset = PRODUCT_MODEL.objects.prefetch_related('additional_variants').filter(active=True)
    queryset = filter_products(request, queryset)
    
    pagination_instance = CustomPagination()
    result = pagination_instance.paginate_queryset(queryset, request)
    
    serializer = ProductSerializer(data=result, many=True)
    serializer.is_valid()
    
    additional_infos = {
        'total_count':  queryset.count()
    }
    
    return pagination_instance.get_paginated_response(serializer.data, additional_infos=additional_infos)


@api_view(['get'])
def reviews(request, product_id, **kwargs):
    product = get_object_or_404(Product, id=product_id)
    reviews = product.review_set.all()
    serializer = ReviewSerializer(instance=reviews, many=True)
    return success_response(serializer)


def get_products_via_stock(request, **kwargs):
    pass


@api_view(['post'])
@permission_classes([IsAuthenticated])
def create_whishlist_view(request, **kwargs):
    """Create a specific whishlist"""
    serializer = ValidateWishList(data=request.data)
    serializer.is_valid(raise_exception=True)
    new_serializer = serializer.create(request)
    return Response(data=new_serializer.data, status=status.HTTP_201_CREATED)


@api_view(['get'])
@permission_classes([IsAuthenticated])
def whishlist_view(request, **kwargs):
    """Get a specific whishlist"""


@api_view(['get'])
@permission_classes([IsAuthenticated])
def whishlists_view(request, **kwargs):
    """Get all the user's whishlists"""
    # whishlist = get_object_or_404(Wishlist, user=request.user)
    # serializer = WishlistSerializer(instance=whishlist)
    # return Response(data=serializer.data)
    return Response(data=[{'id': 1, 'name': 'General'}])
    


@api_view(['post'])
@permission_classes([IsAuthenticated])
def add_to_wishlist_view(request, pk, **kwargs):
    """Add a product to a specific whishlist"""
    # whishlist = get_object_or_404(Wishlist, id=pk)
    # serializer = ValidateAddToList(instance=whishlist, data=request.data)
    # serializer.is_valid(raise_exception=True)
    # serializer.save()
    # return Response(data={'status': True}, status=status.HTTP_200_OK)
    return Response(data={})


@api_view(['get'])
@permission_classes([IsAuthenticated])
def liked_products_view(request, **kwargs):
    """Return all the products liked by a given user"""
    user_list = get_object_or_404(Like, user=request.user)
    serializer = LikeSerializer(instance=user_list)
    return Response(data=serializer.data)


@api_view(['post'])
@permission_classes([IsAuthenticated])
def add_liked_view(request, pk, **kwargs):
    """Add a product to the like list"""
    # product = get_object_or_404(PRODUCT_MODEL, id=pk)
    # likes = product.like_set.filter(user=request.user)
    # if likes.exists():
    #     return Response(data={'status': 'Exists'})
    # else:
    #     instance, state = Like.objects.get_or_create(user=request.user)
    #     instance.products.add(product)
    # return Response(data={'status': True}, status=status.HTTP_201_CREATED)
    return Response(data={})


class WishlistView(GenericViewSet, ListModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin):
    permission_classes = []
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    
    def list(self, request, *args, **kwargs):
        filtered_queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(filtered_queryset, many=True)
        return Response(data=serializer.data)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user_wishlists = queryset.filter(user__id=1)
        return user_wishlists
    
    def create(self, request, *args, **kwargs):
        # Use a specific validating type of
        # Serializer in order to validate the
        # incoming data
        validator = ValidateAddToList(data=request.data)
        validator.is_valid(raise_exception=True)
        self.perform_create(validator)
        headers = self.get_success_headers(validator.data)
        return Response(data=None, status=status.HTTP_201_CREATED, headers=headers)        

    def update(self, request, *args, **kwargs):
        wishlist = self.get_object()
        # TODO:
        validator = ValidateAddToList(instance=wishlist, data=request.data)
        validator.is_valid(raise_exception=True)
        validator.remove_product(wishlist)
        return Response(data=validator.data)


@api_view(['post'])
def product_variants_view(request, pk, **kwargs):
    """Return all the products which carry the
    same name but have a different color variant"""
    product = get_object_or_404(PRODUCT_MODEL, id=pk)
    products = PRODUCT_MODEL.objects.filter(name__exact=product.name)
    serializer = SimpleProductVariantSerializer(instance=products, many=True)
    return Response(data=serializer.data)

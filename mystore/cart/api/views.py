from cart.api import serializers
from cart.api.serializers import ValidateCart, build_cart_response
from cart.managers import SessionManager
from cart.models import Cart
from django.db.models import F, Q
from django.shortcuts import get_list_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound
from rest_framework.generics import (CreateAPIView, DestroyAPIView,
                                     ListAPIView, UpdateAPIView)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response


class CartMixin:
    def get_cart_items(self):
        # Since the cart contains multiple porducts we might
        # to perform a delete on multiple objects
        queryset = self.get_queryset()

        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        filter_kwargs = {
            f'{self.lookup_field}__icontains': self.kwargs[lookup_url_kwarg]
        }
        items = get_list_or_404(queryset, **filter_kwargs)

        for item in items:
            self.check_object_permissions(self.request, item)
        return items


class ListCartsView(ListAPIView):
    """Returns all the carts in the current shop
    that were created by the users (authenticated
    and none authenticated ones)"""

    serializer_class = serializers.CartSerializer
    queryset = Cart.objects.all()
    permission_classes = [IsAuthenticated]


class ListCartView(ListAPIView):
    """Return all items that were saved
    in the specific user's cart"""

    serializer_class = serializers.CartSerializer
    permission_classes = [AllowAny]
    queryset = Cart.objects.all()
    _session_id_cache = None

    def get_queryset(self):
        queryset = super().get_queryset()
        unique_id = self.kwargs.get('unique_id')
        user_cart = queryset.filter(session_id__icontains=unique_id)

        result = user_cart.values('session_id').first()
        self._session_id_cache = result['session_id']
        return user_cart

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        if not queryset.exists():
            return Response(data=[], code=status.HTTP_404_NOT_FOUND)
        data = build_cart_response(queryset, self._session_id_cache)
        self._session_id_cache = None
        return Response(data=data)


# TODO: Test this class
class DeleteFromCart(DestroyAPIView):
    """Delete a set of objects from the cart"""

    permission_classes = [AllowAny]
    serializer_class = ValidateCart
    queryset = Cart.objects.all()

    def destroy(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            raise NotFound(detail={
                'products': 'Products not found'
            })

        for item in queryset:
            self.perform_destroy(item)

        reevaluated_queryset = self.get_queryset()
        serializer = self.get_serializer(instance=reevaluated_queryset)
        return Response(serializer.data, code=status.HTTP_204_NO_CONTENT)

    def get_queryset(self):
        queryset = super().get_queryset()

        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        logic = Q(session_id__exact=serializer.validated_data['session_id'])
        if self.request.user.is_authenticated:
            logic = logic & Q(user=self.request.user)

        return queryset.filter(logic)


class AddToCartView(CreateAPIView):
    """Add a product to the cart. This allows the customer
    to add products being anonymous or logged in. In the
    first case, it returns a `session_id` used to identify
    the user and the list of products that were added to the
    cart for the given session"""

    serializer_class = ValidateCart
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        return serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        session_id, queryset = self.perform_create(serializer)

        data = build_cart_response(queryset, session_id)
        headers = self.get_success_headers(data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)


@api_view(['post'])
@permission_classes([AllowAny])
def authenticate_user_cart(request, **kwargs):
    """Allows us to authenticate the items in the
    user's cart once they are logged in. This gets
    triggered only in the case where the user
    has started adding items when he was not
    authenticated and then authenticates for
    the payment process"""
    session_id = request.data.get('session_id', None)
    if session_id is not None and request.user.is_authenticated:
        queryset = Cart.objects.filter(session_id=session_id)
        queryset.update(user=request.user, is_anonymous=~F('is_anonymous'))
    return Response({'status': True})


class UpdateInCartView(CartMixin, UpdateAPIView):
    """Update item in cart (quantity, size...)"""

    serializer_class = ValidateCart
    permission_classes = [AllowAny]
    lookup_url_kwarg = 'unique_id'
    lookup_field = 'session_id'

    def get_object(self):
        return self.get_cart_items()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)

        items = self.get_object()

        initial_serializer = None
        for item in items:
            serializer = self.get_serializer(item, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)

            if initial_serializer is None:
                initial_serializer = serializer

            self.perform_update(serializer)

            if getattr(item, '_prefetched_objects_cache', None):
                item._prefetched_objects_cache = {}

        session_id = initial_serializer.validated_data['session_id']

        queryset = Cart.objects.filter(id=(item.id for item in items))        

        data = build_cart_response(queryset, session_id)
        return Response(data=data)


class DeleteFromCart(DestroyAPIView):
    """Delete one or multiple products
    from the user cart"""

    serializer_class = ValidateCart
    queryset = Cart.objects.all()
    lookup_url_kwarg = 'unique_id'
    lookup_field = 'session_id'

    def get_object(self):
        # Since the cart contains multiple porducts we might
        # to perform a delete on multiple objects
        queryset = self.get_queryset()

        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        filter_kwargs = {
            f'{self.lookup_field}__icontains': self.kwargs[lookup_url_kwarg]
        }
        items = get_list_or_404(queryset, **filter_kwargs)

        for item in items:
            self.check_object_permissions(self.request, item)
        return items

    def destroy(self, request, *args, **kwargs):
        items = self.get_object()

        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        session_id = serializer.validated_data['session_id']
        product_id = serializer.validated_data['product']['id']
        size = serializer.validated_data['size']
        color = serializer.validated_data['product']['color']

        items_to_delete = []
        items_to_keep = []
        for item in items:
            if item.product.id == product_id:
                if item.size == size:
                    items_to_delete.append(item)
                    continue
            items_to_keep.append(item)

        for item in items:
            # self.perform_destroy(item)
            pass

        queryset = Cart.objects.filter(
            id__in=(item.id for item in items_to_keep)
        )

        data = build_cart_response(queryset, session_id)
        return Response(data=data, status=status.HTTP_204_NO_CONTENT)


class CreateSessionID(CreateAPIView):
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        manager = SessionManager(self.request)
        return Response({'token': manager.create_session_key()})
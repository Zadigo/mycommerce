from django.db.models import F, QuerySet, Value
from django.db.models.aggregates import Sum
from django.db.models.expressions import Q

from cart.exceptions import ProductActiveError
from cart.utils import SessionManager


class CartManager(QuerySet):
    def cart_items(self, session_id):
        """Return all the items in the user's cart
        using the cart_session_id"""
        session_id = str(session_id)
        return self.filter(session_id=session_id, is_paid_for=False)

    def cart_total(self, request, session_id=None):
        if request.user.is_authenticated:
            queryset = self.filter(user=request.user)
        else:
            queryset = self.filter(session_id=session_id)
        return queryset.aggregate(Sum('price'))

    def remove_from_cart(self, request, product_id, session_id):
        logic = Q(session_id__iexact=session_id)
        if request.user.is_authenticated:
            logic = logic & Q(user=request.user.id)

        queryset = self.filter(logic)

        try:
            product = queryset.get(id=product_id)
        except:
            raise self.model.DoesNotExist()
        else:
            product.delete()
        finally:
            return self.filter(logic)

    def _add_to_cart(self, request, session_id, product, **kwargs):
        if not product.active:
            raise ProductActiveError({'product': 'Product is not active'})

        # The user might have other items in his cart
        # with different session_id keys, mark them
        # as stale before creating new items. We only
        # keep track of what is authenticated because
        # there might be non authenticated items from
        # the same user
        if request.user.is_authenticated:
            authenticated_items = self.filter(user=request.user, is_paid=False)
            authenticated_items.update(is_stale=True)


        # TODO: product.get_price
        # price = product.sale_price if product.on_sale else product.unit_price
        price = product.get_price

        params = {
            'session_id': session_id,
            'product': product,
            'price': price,
            'size': kwargs.get('size'),
            'is_anonymous': not request.user.is_authenticated
        }

        if request.user.is_authenticated:
            params['user'] = request.user

        instance = self.create(**params)
        queryset = self.filter(session_id__iexact=session_id)

        if request.user.is_authenticated:
            # If the user is now authenticated but had items from
            # a previous session where he was not authenticated,
            # implement the user object on the foreign key of
            # the anonymous cart items
            for item in queryset:
                item.user = request.user
                item.is_anonymous = False
                item.save()

        return queryset

    def rest_api_add_to_cart(self, request, product, session_id=None, **kwargs):
        # NOTE: In this function, we should be receiving the
        # session_id for the cart from the frontend if a new
        # cart
        if session_id is None:
            session_id = SessionManager.create_session_key()
        queryset = self._add_to_cart(request, session_id, product, **kwargs)
        return session_id, queryset

    def add_to_cart(self, request, product, **kwargs):
        # NOTE: Works in combination with session backends. When
        # using rest API, the session does not actively persist
        # which turns out having a new cart creation every time
        session_manager = SessionManager(request)
        session_id = session_manager.get_or_create()
        return self._add_to_cart(request, session_id, product, **kwargs)

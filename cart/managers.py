from django.core.exceptions import MultipleObjectsReturned
from django.db.models import F, QuerySet, Value
from django.db.models.aggregates import Sum
from django.db.models.expressions import Q
from django.db.models.fields import IntegerField

from cart.exceptions import ProductActiveError
from cart.utils import SessionManager


class CartManager(QuerySet):
    def _update_quantity(self, queryset, expression):
        try:
            cart_instance = queryset.get()
        except:
            return None
        else:
            cart_instance.quantity = expression
            cart_instance.save()
            cart_instance.refresh_from_db()
            return cart_instance
        
    def cart_items(self, session_id):
        """Return all the items in the user's cart
        using the cart_session_id"""
        session_id = str(session_id)
        return self.filter(session_id=session_id, is_paid_for=False)
    
    def cart_total(self, session_id):
        queryset = self.cart_items(session_id)
        return queryset.aggregate(Sum('price'))
    
    def _add_to_cart(self, request, session_id, product, **kwargs):
        if not product.active:
            raise ProductActiveError('Product is not active')
        
        if product.on_sale:
            price = product.sale_price
        else:
            price = product.unit_price
        
        params = {
            'session_id': session_id,
            'product': product,
            'price': price,
            'default_size': kwargs.get('default_size')[-1],
            'is_anonymous': not request.user.is_authenticated
        }

        if request.user.is_authenticated:
            params['user'] = request.user

        instance = self.create(**params)
        
        if request.user.is_authenticated:
            return self.filter(Q(user=request.user))
        
        return self.filter(session_id__iexact=session_id)
    
    def rest_api_add_to_cart(self, request, product, session_id=None, **kwargs):
        # NOTE: In this function, we should be receiving the
        # session_id for the cart from the frontend if a new
        # cart
        # TODO: When the user is authenticated, the session_id
        # does not make any sense since we know the user
        if session_id is None:
            session_id = SessionManager.create_session_key()
        queryset = self._add_to_cart(request, session_id, product, **kwargs)
        # If the user is authenticated but has cart from a previous
        # session where he was not authenticated, implement
        # the user on th foreign key of the anonymous carts
        if request.user.is_authenticated:
            for item in queryset:
                item.user = request.user
                item.is_anonymous = False
                item.save()
        return session_id, queryset
    
    def add_to_cart(self, request, product, **kwargs):
        # NOTE: Works in combination with session backends. When 
        # using rest API, the session does not actively persist
        # which turns out having a new cart creation every time
        session_manager = SessionManager(request)
        session_id = session_manager.get_or_create()
        return self._add_to_cart(request, session_id, product, **kwargs)
            
    def increase_quantity(self, cart_session_id):
        queryset = self.get_cart_products(cart_session_id)
        return self._update_quantity(queryset, F('quantity') + 1)
    
    def decrease_quantity(self, cart_session_id):
        queryset = self.get_cart_products(cart_session_id)
        return self._update_quantity(queryset, F('quantity') - 1)

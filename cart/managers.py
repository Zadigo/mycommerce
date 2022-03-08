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
        
    def get_cart_products(self, session_id):
        """Return all the items in the user's cart
        using the cart_session_id"""
        reference = str(session_id)
        return self.filter(session_id__iexact=reference, is_paid_for=False)
    
    def get_cart_total(self, session_id):
        queryset = self.get_cart_products(session_id)
        return queryset, queryset.aggregate(Sum('total'))
    
    def _add_to_cart(self, session_id, product, quantity, variants={}):
        if not product.is_active:
            raise ProductActiveError('Product is not active')
        
        queryset = self.filter(session_id__iexact=session_id)
        if queryset.exists():
            logic = Q(product__id=4)

            if variants:
                for value in variants.values():
                    logic = logic & Q(product__variants__name=value)

            existing_cart = queryset.filter(logic)

            if existing_cart.exists():
                try:
                    element = existing_cart.get()
                except:
                    raise MultipleObjectsReturned('Multiple products in cart')

                element.price_pre_tax = product.unit_price
                element.quantity = F('quantity') + int(quantity)
                element.total = element.quantity * product.unit_price
                element.save()
                element.refresh_from_db()
                return element

        params = {
            'session_id': 'sN8z0YHxlCW8',
            'product': product,
            'quantity': quantity,
            'price_pre_tax': product.unit_price,
            'total': quantity * product.unit_price,
            'is_anonymous': True
        }

        instance = self.create(**params)
        return instance, self.filter(session_id__iexact=session_id)
    
    def rest_api_add_to_cart(self, product, quantity, session_id=None, variants: dict={}):
        # NOTE: In this function, we should be receiving the
        # session_id for the cart from the frontend
        if session_id is None:
            session_id = SessionManager.create_session_key()
        return self._add_to_cart(session_id, product, quantity, variants)
    
    def add_to_cart(self, request, product, quantity, variant: dict={}):
        #NOTE: Works in combination with session backends. When 
        # using rest API, the session does not actively persist
        # which turns out having a new cart creation every time
        session_manager = SessionManager(request)
        return self._add_to_cart(session_manager.get_or_create(), product, quantity, variant)
        
        # queryset = self.filter(session_id__iexact=session_manager.get_or_create())
        
        # if queryset.exists():
        #     # If a variant of the product is provided,
        #     # like color, size etc. then use that variant
        #     # as opposed to the base product
        #     # if variant:
        #     #     product_variant = product.variants.filter(**variant)
                
        #     # Check if product is already in the
        #     # cart and if yes, update quantity,
        #     # variant etc.
        #     logic = (Q(product__id=product.id))
        #     existing_product_in_cart = queryset.filter(logic)
            
        #     if existing_product_in_cart.exists():
        #         try:
        #             element = existing_product_in_cart.get()
        #         except:
        #             # We cannot have multiple items of the
        #             # same product in the cart with the
        #             # same cart_session_id
        #             raise MultipleObjectsReturned('Multiple products returned in cart')
                
        #         element.price_pre_tax = product.unit_price
        #         element.quantity = F('quantity') + int(quantity)
        #         element.total = element.quantity * product.unit_price
        #         element.save()
        #         element.refresh_from_db()
        #         return element
            
        # params = {
        #     'session_id': session_manager.cart_session_id, 
        #     'product': product,
        #     'quantity': quantity,
        #     'quantity': quantity,
        #     'price_pre_tax': product.unit_price,
        #     'total': quantity * product.unit_price,
        #     'is_anonymous': request.user.is_anonymous
        # }
        
        # if request:
        #     if request.user.is_authenticated:
        #         params['user'] = request.user
        
        # instance = self.create(**params)
        # return instance, self.filter(session_id__iexact=session_manager.cart_session_id)
    
    def increase_quantity(self, cart_session_id):
        queryset = self.get_cart_products(cart_session_id)
        return self._update_quantity(queryset, F('quantity') + 1)
    
    def decrease_quantity(self, cart_session_id):
        queryset = self.get_cart_products(cart_session_id)
        return self._update_quantity(queryset, F('quantity') - 1)


from cart.exceptions import ProductActiveError
from django.conf import settings
from django.db.models import QuerySet
from django.db.models.aggregates import Sum
from django.db.models.expressions import Q
from rest_framework.exceptions import ValidationError

from mystore.custom_utilities.tokens import JWTGenerator


class QuerySetDoesNotExist(Exception):
    def __init__(self):
        super().__init__(
            "Selected products do not exist"
        )


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

    def items_to_remove(self, request, product_id, session_id, size=None):
        queryset = self.filter(product__id=product_id)

        logic = Q(session_id=session_id)

        if size is not None:
            logic = logic & Q(size=size)

        if request.user.is_authenticated:
            logic = logic & Q(user=request.user)

        queryset = queryset.filter(logic)

        if not queryset.exists():
            raise QuerySetDoesNotExist()

        return queryset

        # logic = Q(session_id=session_id)
        # if request.user.is_authenticated:
        #     logic = logic & Q(user=request.user)

        # if size is not None:
        #     logic = logic & Q(size=size)

        # if color is not None:
        #     logic = logic & Q(color=color)

        # queryset = self.filter(logic)

        # queryset = queryset.filter(id=product_id)
        # if not queryset.exists():
        #     raise QuerySetDoesNotExist()

        # for product in queryset:
        #     product.delete()
        # return self.filter(logic)

    def _add_to_cart(self, request, session_id, product, **kwargs):
        """The `_add_to_cart` function is a core method in the CartManager 
        class that handles adding products to a user's cart. It supports 
        both authenticated and anonymous users, ensuring that products 
        are properly managed and associated with the correct 
        session or user"""
        if not product.active:
            raise ProductActiveError(
                detail={'product': 'Product is not active'})

        # The user might have other items in his cart
        # with different session_id keys, mark them
        # as stale before creating new items. We only
        # keep track of what is authenticated because
        # there might be non authenticated items from
        # the same user that are more difficult to track
        if request.user.is_authenticated:
            authenticated_items = self.filter(
                user=request.user,
                is_paid_for=False
            )
            authenticated_items.update(is_stale=True)

        params = {
            'session_id': session_id,
            'product': product,
            # TODO: Implement the ability to use VAT price if applicable
            'price': product.get_price,
            'size': None,
            'is_anonymous': not request.user.is_authenticated
        }

        size_string = kwargs.get('size')

        if size_string != 'Unique':
            message = f'Product with size {size_string} is no available'
            sizes = product.size_set.filter(name=size_string)

            try:
                size = sizes.get(name=size_string)
            except:
                raise ValidationError(detail={'size': message})
            else:
                if not size.active or not size.availability:
                    raise ValidationError(detail={'size': message})

                params['size'] = size.name

        # If the frontend is trying to create
        # an object with a product that requires
        # a specific size, raise a ValidationError
        if size_string == 'Unique':
            if product.has_sizes:
                message = (
                    "Trying to use a 'unique' size "
                    "on a product that contains sizes"
                )
                raise ValidationError(detail={'size': message})

        if request.user.is_authenticated:
            params['user'] = request.user

        instance = self.create(**params)
        # Use the session_id to try and identify previous
        # products that were added using the same session_id
        # key. This will allow us later on to authenticate these
        # products when/if the user logs in
        queryset = self.filter(session_id__iexact=session_id)

        if request.user.is_authenticated:
            # If the user is now authenticated but had items from
            # a previous session where he was not authenticated,
            # implement the user object on the foreign key of
            # the anonymous cart items
            for item in queryset:
                if item.user is not None:
                    continue

                item.user = request.user
                item.is_anonymous = False
                item.save()

        return queryset

    def rest_api_add_to_cart(self, request, product, session_id=None, **kwargs):
        """Adds products to the cart, supporting both anonymous and authenticated users.
        The function handles adding products to a user's cart in two scenarios:

        * Anonymous User: If the user is not logged in, a `session_id` is created
        to uniquely identify the user's session and track the cart items

        * Authenticated User: Even though the `session_id` is still used, the function
        also associates the cart items with the authenticated user, ensuring their cart
        is preserved across sessions
        """
        if session_id is None:
            issuer = getattr(settings, 'PY_UTILITIES_JWT_ISSUER')
            instance = JWTGenerator(issuer, 'cart', 'cart', expiration_days=3)
            session_id = instance.create()
        queryset = self._add_to_cart(request, session_id, product, **kwargs)
        return session_id, queryset

    def add_to_cart(self, request, product, **kwargs):
        """Works in combination with session backends. When
        using rest `rest_api_add_to_cart`, the session does not actively 
        persist which can inadvertly create a new cart every time"""
        issuer = getattr(settings, 'PY_UTILITIES_JWT_ISSUER')
        instance = JWTGenerator(issuer, 'cart', 'cart', expiration_days=3)
        session_id = instance.create()
        return self._add_to_cart(request, session_id, product, **kwargs)

from typing import Optional

import pandas
from services.mycart.cart.api.serializers import CartSerializer
from services.mycart.cart.models import Cart
from services.mycart.discounts.models import Discount
from django.core.cache import cache
from itertools import chain

from mcp_server import MCPToolset, ModelQueryToolset


def get_queryset(force_refresh: bool = False) -> Cart:
    key = 'mcp_carts'
    qs = cache.get(key)
    if qs is None or force_refresh:
        qs = Cart.objects.prefetch_related('user', 'customer_orders').all()
        cache.set(key, qs, timeout=60 * 60 * 24)  # Cache for 24 hours
    return qs


class CartQueryTool(ModelQueryToolset):
    model = Cart
    search_fields = [
        'user__email',
        'order_reference',
        'quantity',
        'total',
        'is_stale',
        'is_anonymous',
        'is_paid_for',
        'created_on'
    ]

    def get_queryset(self):
        return get_queryset()


class CartTools(MCPToolset):
    def get_inactive_carts(self) -> list[dict]:
        """Returns a list of carts that are not paid for. The customer
        may have abandoned the cart or may have been inactive for a long time.

        Returns:
            list[dict]: A list of dictionaries representing the inactive carts.
        """
        inactive_qs = get_queryset().filter(is_stale=True)
        return CartSerializer(instance=inactive_qs, many=True).data

    def get_anonymous_carts(self) -> list[dict]:
        """Returns a list of carts that are associated with anonymous users.

        Returns:
            list[dict]: A list of dictionaries representing the anonymous carts.
        """
        anonymous_qs = get_queryset().filter(is_anonymous=True)
        return CartSerializer(instance=anonymous_qs, many=True).data

    def get_authenticated_user_carts(self) -> list[dict]:
        """Returns a list of carts that are associated with authenticated users.

        Returns:
            list[dict]: A list of dictionaries representing the authenticated user carts.
        """
        auth_qs = get_queryset().filter(is_anonymous=False)
        return CartSerializer(instance=auth_qs, many=True).data

    def get_cart_statistics(self, quarter: Optional[int] = None, min_date: Optional[str] = None, max_date: Optional[str] = None, is_anonymous: Optional[bool] = None, is_paid_for: Optional[bool] = None) -> dict:
        """Returns statistics about anonymous carts, including the total number of
        anonymous carts and the average total value of those carts.

        Args:
            quarter (Optional[int]): The quarter to filter the carts by (1-4).
            min_date (Optional[str]): The minimum date to filter the carts by (in the format 'YYYY-MM-DD').
            max_date (Optional[str]): The maximum date to filter the carts by (in the format 'YYYY-MM-DD').
            is_anonymous (Optional[bool]): Whether to filter by anonymous carts (True) or authenticated user carts (False).
            is_paid_for (Optional[bool]): Whether to filter by paid for carts (True) or unpaid carts (False).

        Returns:
            dict: A dictionary containing the mean, standard deviation etc. of the total value of the carts that match the specified filters.
        """
        qs = get_queryset()

        if is_paid_for is not None:
            if is_paid_for:
                qs = qs.filter(is_paid_for=True)
            else:
                qs = qs.filter(is_paid_for=False)

        if quarter is not None:
            if quarter < 1 or quarter > 4:
                raise ValueError("Quarter must be between 1 and 4")
            
            qs = qs.filter(created_on__quarter=quarter)

        if is_anonymous is not None:
            if is_anonymous:
                qs = qs.filter(is_anonymous=True)
            else:
                qs = qs.filter(is_anonymous=False)


        if min_date is not None:
            qs = qs.filter(created_on__date__gte=min_date)

        if max_date is not None:
            qs = qs.filter(created_on__date__lte=max_date)

        if qs.exists():
            df = pandas.DataFrame(qs.values('id', 'total'))
            return df.describe().to_dict()['total']

        return {
            'count': 0,
            'mean': 0,
            'std': 0,
            'min': 0,
            '25%': 0,
            '50%': 0,
            '75%': 0,
            'max': 0
        }

    def get_carts_between_dates(self, start_date: str, end_date: str) -> list[dict]:
        """Returns a list of carts that were created between the specified start and end dates.

        Args:
            start_date (str): The start date in the format 'YYYY-MM-DD'.
            end_date (str): The end date in the format 'YYYY-MM-DD'.

        Returns:
            list[dict]: A list of dictionaries representing the carts created between the specified dates.
        """
        between_qs = get_queryset()
        between_qs = between_qs.filter(
            created_on__date__gte=start_date,
            created_on__date__lte=end_date
        )
        return CartSerializer(instance=between_qs, many=True).data

    def check_discount_on_cart(self, cart_id: int, discount_id: str | int) -> dict:
        """Checks if a discount is applied to the cart with the given ID.

        Args:
            cart_id (int): The ID of the cart to check for discounts.

        Returns:
            dict: A dictionary containing information about the discount applied to the cart, if any.
        """
        cart = get_queryset().filter(id=cart_id).first()
        if not cart:
            return {'error': 'Cart not found'}

        try:
            discount = Discount.objects.filter(id=discount_id).first()
        except Discount.DoesNotExist:
            return {'error': 'Discount not found'}

        return {'message': 'No discount applied to this cart'}
    
    def get_cart_products(self) -> list:
        """Returns a list of all products in the carts.
        
        Returns:
            list: A list of all products in the carts.
        """
        items = [
            cart_item.items
            for cart_item in get_queryset()
        ]
        return list(chain(*items))


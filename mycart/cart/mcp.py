import pandas
from cart.api.serializers import CartSerializer
from cart.models import Cart
from django.core.cache import cache
from mcp_server import MCPToolset, ModelQueryToolset


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
        qs = super().get_queryset()
        return qs.prefetch_related('customer_order').all()


class CartTools(MCPToolset):
    def _get_queryset(self, force_refresh: bool = False):
        qs = cache.get('mcp_carts')
        if qs is None or force_refresh:
            qs = Cart.objects.prefetch_related('user')
            cache.set('mcp_carts', qs, timeout=60 *
                      60 * 24)  # Cache for 24 hours
        return qs.all()

    def get_all_carts(self) -> list[dict]:
        """Returns a list of all carts in the database.

        Returns:
            list[dict]: A list of dictionaries representing the carts.
        """
        return CartSerializer(instance=self._get_queryset(), many=True).data

    def get_inactive_carts(self) -> list[dict]:
        """Returns a list of carts that are not paid for. The customer
        may have abandoned the cart or may have been inactive for a long time.

        Returns:
            list[dict]: A list of dictionaries representing the inactive carts.
        """
        inactive_qs = self._get_queryset().filter(is_stale=True)
        return CartSerializer(instance=inactive_qs, many=True).data

    def get_anonymous_carts(self) -> list[dict]:
        """Returns a list of carts that are associated with anonymous users.

        Returns:
            list[dict]: A list of dictionaries representing the anonymous carts.
        """
        anonymous_qs = self._get_queryset().filter(is_anonymous=True)
        return CartSerializer(instance=anonymous_qs, many=True).data

    def get_authenticated_user_carts(self) -> list[dict]:
        """Returns a list of carts that are associated with authenticated users.

        Returns:
            list[dict]: A list of dictionaries representing the authenticated user carts.
        """
        auth_qs = self._get_queryset().filter(is_anonymous=False)
        return CartSerializer(instance=auth_qs, many=True).data

    def get_anonnymous_cart_statistics(self) -> dict:
        """Returns statistics about anonymous carts, including the total number of
        anonymous carts and the average total value of those carts.

        Returns:
            dict: A dictionary containing statistics about anonymous carts.
        """
        anonymous_qs = self._get_queryset().filter(is_anonymous=True)
        if anonymous_qs.exists():
            df = pandas.DataFrame(anonymous_qs.values('id', 'total'))
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
        between_qs = self._get_queryset()
        between_qs = between_qs.filter(
            created_on__date__gte=start_date,
            created_on__date__lte=end_date
        )
        return CartSerializer(instance=between_qs, many=True).data

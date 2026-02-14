from django.contrib.auth import get_user_model
from django_mcp import mcp_app as mcp
from mcp.server.fastmcp import Context
from mcp_server import MCPToolset, ModelQueryToolset
from orders.models import CustomerOrder, Product


class UserQueryTool(ModelQueryToolset):
    model = get_user_model()
    search_fields = [
        'first_name',
        'last_name',
        'email'
    ]


class ProductQueryTool(ModelQueryToolset):
    model = Product
    search_fields = [
        'reference',
        'serialized_data',
        'unit_price',
        'customer_order',
        'created_on',
    ]

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.prefetch_related('customer_order').all()


class CustomerOrderQueryTool(ModelQueryToolset):
    model = CustomerOrder
    search_fields = [
        'reference',
        'user__email',
        'user__first_name',
        'user__last_name',
        'address',
        'city',
        'zip_code',
        'country',
        'total',
        'notes',
        'completed',
        'refund_requested',
        'stock_updated',
        'return_delay',
        'max_return_delay',
        'created_on'
    ]

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.prefetch_related('user').all()


class UserTools(MCPToolset):
    def get_by_reference(self, reference: str):
        pass

    def get_by_email(self, email: str):
        pass

    def get_by_total(self, min_total: float = None, max_total: float = None):
        pass

    def get_by_refund_requested(self, refund_requested: bool = True):
        pass

    def get_return_delay(self, order_reference: str):
        pass

    def update_order(self, order_reference: str, **kwargs):
        pass

    def email_customer(self, email: str, subject: str, message: str):
        pass

    def transfer_to_external_crm(self, crm_name: str, from_date: str = None, to_date: str = None):
        pass

    def get_orders_for_this_month(self):
        pass

    def get_orders_for_this_week(self):
        pass


@mcp.prompt('sync_customers_with_google_ads')
async def sync_customers_with_google_ads(ctx: Context):
    pass


@mcp.prompt('sync_orders_with_facebook_ads')
async def sync_orders_with_facebook_ads(ctx: Context):
    pass

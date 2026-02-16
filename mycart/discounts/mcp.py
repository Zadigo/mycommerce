from discounts.models import Discount
from mcp_server import MCPToolset, ModelQueryToolset


class DiscountQueryTool(ModelQueryToolset):
    model = Discount
    search_fields = [
        'reference',
        'name',
        'products__name',
        'percentage',
        'start_date',
        'end_date',
        'created_on'
    ]


class DiscountTools(MCPToolset):
    def get_all_discounts(self):
        pass

    def get_discount_by_name(self, name: str):
        pass

    def email_user_for_discount(self, user_id: int, subject: str, message: str):
        pass

    def get_user_emails(self, email: str):
        pass

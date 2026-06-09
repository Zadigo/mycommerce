from discounts.models import Discount
from mcp_server import MCPToolset, ModelQueryToolset
from django.contrib.auth import get_user_model


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
    def email_user_for_discount(self, email: str, subject: str, message: str):
        """Send an email to a user regarding a discount.
        
        Args:
            email (str): The email address of the user to contact.
            subject (str): The subject of the email.
            message (str): The body of the email.
        """
        user = get_user_model().objects.filter(email=email).first()
        if user is not None:
            user.email_user(subject, message)

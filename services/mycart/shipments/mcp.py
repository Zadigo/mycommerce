from mcp.server.fastmcp import Context
from mcp_server import MCPToolset, ModelQueryToolset, mcp_server
from services.mycart.shipments.models import Shipment


class ShipmentQueryTool(ModelQueryToolset):
    model = Shipment
    search_fields = [
        'transporter',
        'tracking_number',
        'customer_order__reference',
        'delivered',
        'created_on'
    ]

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.select_related('customer_order').all()


class ShipmentTools(MCPToolset):
    def get_shipment_by_tracking_number(self, tracking_number: str):
        pass

    def email_user_for_shipment(self, user_id: int, subject: str, message: str):
        pass


@mcp_server.resource('ressources://shipping_policy')
def shipping_policy():
    pass


@mcp_server.resource('ressources://return_policy')
def return_policy():
    pass


@mcp_server.prompt('generate_shipping_label')
def generate_shipping_label(ctx: Context, shipment_id: int):
    pass

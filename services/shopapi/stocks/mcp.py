from mcp_server import ModelQueryToolset
from stocks.models import Stock, StockAlert



class StockQueryTool(ModelQueryToolset):
    model = Stock
    search_fields = [
        'variant',
        'quantity',
        'total',
        'is_active'
    ]


class StockAlertQueryTool(ModelQueryToolset):
    model = StockAlert
    search_fields = [
        'user',
        'variant',
        'alert_sent',
        'created_on'
    ]

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.select_related('user', 'variant')


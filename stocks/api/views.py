from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny

from stocks.api.serializers import StockSerializer
from stocks.models import Stock


class GetProductStockStatus(RetrieveAPIView):
    serializer_class = StockSerializer
    queryset = Stock.objects.filter(is_active=True)
    lookup_field = 'product__id'
    lookup_url_kwarg = 'pk'
    permission_classes = [AllowAny]

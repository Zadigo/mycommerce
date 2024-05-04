from rest_framework.decorators import api_view
from rest_framework.response import Response

from stocks.api.serializers import StockSerializer
from stocks.models import Stock


@api_view(['post'])
def get_product_stock_status(request, **kwargs):
    product_id = request.data.get('product', None)
    try:
        stock = Stock.objects.get(product__id=product_id)
    except:
        # Assume that the product is in stock
        # automatically since we do not have
        # a model to track the stock for that
        # particular product
        return Response({})
    else:
        serializer = StockSerializer(instance=stock)
        return Response(serializer.data)

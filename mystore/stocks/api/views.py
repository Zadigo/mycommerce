from cart.api.serializers import cart_statistics
from cart.models import Cart
from django.db.models import Count, F
from django.shortcuts import get_object_or_404
from orders.models import CustomerOrder
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import Response
from stocks.api import serializers
from stocks.models import Stock


class GetProductStockStatus(RetrieveAPIView):
    """Get the current stock status for a product
    if it contains stock tracking element"""

    serializer_class = serializers.StockSerializer
    queryset = Stock.objects.filter(is_active=True)
    lookup_field = 'product__id'
    lookup_url_kwarg = 'pk'
    permission_classes = [AllowAny]


class UpdateStockStatus(GenericAPIView):
    serializer_class = serializers.UpdateStockSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        customer_order = get_object_or_404(
            CustomerOrder,
            reference=serializer.validated_data['customer_order']
        )

        carts = Cart.objects.filter(order_reference=customer_order.reference)
        statistics = cart_statistics(carts)

        updated_items = []
        for item in statistics:
            queryset = Stock.objects.filter(product__id=item['product__id'])
            if queryset.exists():
                stock_obj = queryset.get()
                stock_obj.quantity = F('quantity') - item['quantity']
                stock_obj.save()
                updated_items.append(stock_obj)

        serializer = self.serializer_class(
            instance=updated_items, 
            many=True
        )
        return Response(serializer.data)

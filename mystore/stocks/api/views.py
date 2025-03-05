from cart.api.serializers import cart_statistics
from cart.models import Cart
from django.db.models import F
from django.shortcuts import get_object_or_404
from orders.models import CustomerOrder
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import Response
from stocks.api import serializers
from stocks.models import Stock


class GetProductStockStatus(generics.RetrieveAPIView):
    """Get the current stock status for a product
    if it contains stock tracking element"""

    queryset = Stock.objects.all()
    serializer_class = serializers.StockSerializer
    permission_classes = [AllowAny]

    def get(self, request, pk, **kwargs):
        try:
            product = Stock.objects.get(
                variant__product__id=pk,
                variant__product__active=True
            )
        except:
            data = {}
            response_status = status.HTTP_202_ACCEPTED
        else:
            response_status = status.HTTP_200_OK
            serializer = self.get_serializer(instance=product)
            data = serializer.data

        return Response(data, status=response_status)


class UpdateStockStatus(generics.GenericAPIView):
    """An endpoint that is used to update the amount of
    products. This endpoint is triggered by the sucess
    page in Nuxt or by the payment page"""

    queryset = Stock.objects.filter()
    serializer_class = serializers.UpdateStockSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        reference = serializer.validated_data['customer_order']
        customer_order = get_object_or_404(
            CustomerOrder,
            reference=reference,
            stock_updated=False
        )

        carts = Cart.objects.filter(order_reference=customer_order.reference)
        statistics = cart_statistics(carts)

        # TODO: Prevent overoloading aka when an order has updated the
        # stock prevent malicious users from sending multiple requests
        # that could alter the quantity with the same customer order

        updated_items = []
        for item in statistics:
            queryset = Stock.objects.filter(**{
                'variant__product__id': item['product__id']
            })

            if not queryset.exists():
                break

            stock = queryset.get()
            stock.quantity = F('quantity') - item['quantity']
            stock.save()
            
            updated_items.append(stock)

        if not updated_items:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        # Requery the elements in order to resolve the
        # result of stock.quantity CombinedExpression field
        queryset = self.get_queryset()
        items = queryset.filter(id__in=[item.id for item in updated_items])

        customer_order.stock_updated = ~F('stock_updated')

        serializer = self.serializer_class(instance=items, many=True)
        return Response(serializer.data)

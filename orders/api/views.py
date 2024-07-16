from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# from cart.models import Cart
# from cart.utils import SessionManager
from orders.api.serializers import CustomerOrderSerializer
from orders.models import CustomerOrder, ProductHistory
# from orders.payments.session import SessionBasedPayment


class ListCustomerOrders(ListAPIView):
    """Returns the list of all the customer orders
    that were performed by the user
    """

    http_method_names = ['get']
    serializer_class = CustomerOrderSerializer
    queryset = CustomerOrder.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


# @api_view(['post'])
# def create_order(request, **kwargs):
#     session_manager = SessionManager(request)
#     queryset, total = Cart.objects.get_cart_total(
#         session_manager.cart_session_id)

#     if not queryset.exists():
#         # If by some reason there's nothing in the
#         # cart, then return an error
#         return Response(data={'state': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

#     items = ProductHistory.objects.bulk_create([
#         ProductHistory(unit_price=item.product.unit_price,
#                        product=item.product)
#         for item in queryset
#     ])

#     instance = SessionBasedPayment(request, session_manager=session_manager)
#     instance.execute_payment()

#     params = {'total': total['total__sum']}
#     if request.user.is_authenticated:
#         params.update(user=request.user)

#     customer_order = CustomerOrder.objects.create(**params)
#     customer_order.products.add(*items)

#     queryset.update(is_paid_for=True)

#     serializer = CustomerOrderSerializer(instance=customer_order)
#     return Response(data=serializer.data)


# @api_view(['get'])
# def my_orders_view(request, **kwargs):
#     # This request will only return orders for
#     # customers that have been authenticated
#     orders = CustomerOrder.objects.filter(user__id=1)
#     serializer = CustomerOrderSerializer(instance=orders, many=True)
#     return success_response(serializer=serializer)

from cart.models import Cart
from discounts.models import Discount
from discounts.utils import (calculate_discount, calculate_partial_discount,
                             get_calculated_discount_response)
from django.shortcuts import get_object_or_404
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response


class ApplyDiscountView(GenericAPIView):
    def post(self, request, *args, **kwargs):
        session_id = request.data.get('cart_id')
        discount_code = request.data.get('discount_code')

        cart = get_object_or_404(Cart, session_id=session_id)

        instance = get_object_or_404(Discount, name=discount_code)
        if not instance.is_valid:
            return Response({}, status=400)

        if instance.products is not None and len(instance.products) > 0:
            valid_items, invalid_items, discounted_total, undiscounted_total = calculate_partial_discount(
                cart.items,
                instance.percentage,
                instance.products
            )
            data = get_calculated_discount_response(
                valid_products=valid_items,
                invalid_products=invalid_items,
                discounted_total=discounted_total,
                undiscounted=undiscounted_total
            )
            return Response(data)
        breakpoint()
        data = calculate_discount(cart.total, instance.percentage)
        return Response(get_calculated_discount_response(discounted_total=data))

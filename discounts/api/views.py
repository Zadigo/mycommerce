from django.shortcuts import get_object_or_404
from rest_framework.response import Response

from cart.models import Cart
from discounts.api.serializers import DiscountSerializer
from discounts.models import Discount
from discounts.utils import calculate_discount
from shop.models import Product


def apply_discount(request, **kwargs):
    product = get_object_or_404(Product, pk=1)

    cart = Cart.objects.cart_items('session_idinienoz')
    selected_products = cart.filter(product__id=product.id)

    discount = get_object_or_404(
        Discount,
        name='ETE2025',
        products__id=product.id
    )

    if discount.is_valid:
        # result = calculate_discount(product.get_price, discount.percentage)
        # selected_products.update({'discounted_price': result})
        discounted_prices = product.cart_set.get().discounted_prices
        serializer = DiscountSerializer(instance=discount)
        return Response(serializer.data)
    return Response({})

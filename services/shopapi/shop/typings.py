from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from shop.models import Product
    from rest_framework.request import Request



type TypeProductModel = 'Product'
type TypeRestFrameworkRequest = 'Request'

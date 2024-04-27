import json

from django.db.models import Count
from django.views.generic import ListView
from cart.constants import FORM_FIELDS

from cart.models import Cart


class BaseCartMixin(ListView):
    """A mixin that adds global context
    to all the cart views"""

    model = Cart
    queryset = Cart.objects.all()
    context_object_name = 'cart_items'
    checkout_step = 1

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        queryset = self.get_queryset()
        context['subtotal'] = 145
        context['total'] = 145
        context['checkout_step'] = self.checkout_step
        return context


class CartView(BaseCartMixin):
    """Lists the products in the 
    user's cart"""

    template_name = 'pages/list.html'
    checkout_step = 1
    free_delivery_total = 100

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['free_delivery_total'] = context['total'] - \
            self.free_delivery_total
        return context

    def get_queryset(self):
        if self.request.user.is_authenticated:
            queryset = self.queryset.filter(user=self.request.user)
        else:
            session_id = 'ses_ezofnozienfoz'
            queryset = self.queryset.filter(session_id__eq=session_id)
        queryset = queryset.annotate(quantity=Count('product__id'))
        return queryset


class ShipmentView(BaseCartMixin):
    """Allows the user to enter his
    shipment information"""

    template_name = 'pages/shipment.html'
    checkout_step = 2

    def get_form_fields(self):

        if self.request.user.is_authenticated:
            for field in FORM_FIELDS:
                field['value'] = getattr(
                    self.request.user,
                    field['name'],
                    None
                )
        return json.dumps(FORM_FIELDS)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form_fields'] = self.get_form_fields()
        return context


class PaymentView(BaseCartMixin):
    """Allows the user to enter his
    shipment information"""

    template_name = 'pages/shipment.html'
    checkout_step = 2


class PaymentSuccessView(BaseCartMixin):
    checkout_step = 3

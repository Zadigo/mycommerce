

class BasePaymentView(ListView):
    model = CustomerOrder
    queryset = CustomerOrder.objects.all()
    success_url = 'payment_successful'
    redirect_url = 'no_cart'
    
    def get(self, request, *args, **kwargs):
        self.object_list = self.get_queryset()
        allow_empty = self.get_allow_empty()
        
        if not allow_empty:
            if self.get_paginate_by(self.object_list) is not None:
                is_empty = not self.object_list.exists()
            else:
                is_empty = self.object_list
            
            if is_empty:
                return HttpResponseRedirect(self.redirect_url)
        context = self.get_context_data()
        return self.render_to_response(context)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        data_for_analytics = []
        context['impressions'] = data_for_analytics
        return context

    def get_session_manager(self):
        return SessionManager(self.request)

    def get_queryset(self):
        session_manager = self.get_session_manager()
        queryset, total = self.model.objects.get_cart_products(session_manager)
        return queryset
    
    
class PaymentView(BasePaymentView):
    template_name = 'payment.html'


class ExecutePaymentView(BasePaymentView):
    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        
        queryset = self.get_queryset()

        items = ProductHistory.objects.bulk_create(
            [ProductHistory(unit_price=item.product.unit_price, product=item.product)
                for item in queryset]
        )

        instance = SessionBasedPayment(
            request, session_manager=self.get_session_manager())
        instance.execute_payment()

        params = {'total': total['total__sum']}
        if request.user.is_authenticated:
            params.update(user=request.user)

        customer_order = CustomerOrder.objects.create(**params)
        customer_order.products.add(*items)
        
        queryset.update(is_paid_for=True)
        return response


class PaymentSuccessfulView(BasePaymentView):
    template_name = 'payment_successful.html'
    
    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        session_manager = SessionManager(request)
        session_manager.delete()
        return response


class EmptyCartView(TemplateView):
    template_name = 'no_cart.html'

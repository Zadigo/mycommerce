from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.generic import DetailView, ListView
from shipments.models import Shipment


class ShipmentsView(LoginRequiredMixin, ListView):
    """Returns the user's current active shipments"""

    model = Shipment
    template_name = None
    context_object_name = 'shipments'
    ordering = 'created_on'

    @method_decorator(never_cache)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return self.model.objects.filter(user=self.request.user)


class ShipmentView(LoginRequiredMixin, DetailView):
    """Returns the details fo a current shipment"""

    model = Shipment
    template_name = None
    context_object_name = 'shipment'

    @method_decorator(never_cache)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

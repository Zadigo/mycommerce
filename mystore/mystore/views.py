from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import F, Avg
from django.views.generic import ListView
from orders.models import CustomerOrder
from shop.models import Product
from django.db.models.functions import Rank
from django.db.models import Window


class HomeView(LoginRequiredMixin, ListView):
    queryset = Product.objects.all()
    context_object_name = 'products'
    template_name = 'pages/home.html'

    def get_orders_queryset(self):
        queryset = CustomerOrder.objects.all()
        queryset.annotate(
            average_order=Avg('total')
        )
        return queryset

    def get_ranked_orders(self, queryset):
        window = Window(
            Rank(),
            partition_by=F('unit_price'),
            order_by='-name'
        )
        return queryset.annotate(popularity_rank=window).order_by('popularity_rank')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        queryset = super().get_queryset()
        statistics = queryset.aggregate(
            average_price=Avg('unit_price')
        )

        context['statistics'] = statistics
        context['orders'] = self.get_orders_queryset()
        context['ranked_products'] = self.get_ranked_orders(queryset)
        return context


# def handler404(request, *args, **kwargs):
#     result = re.match(r'(?:fr|en|es)\/products\/\d+\/[a-z-]+', request.path)
#     print(result)
#     if result:
#         print(result)
#         # return product_page(request)
#     return render(request, '404.html')


# def handler500(request, *args, **kwargs):
#     return render(request, '500.html')

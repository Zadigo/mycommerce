from shop.models import Product
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import ListView
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.db.models.functions.window import Rank
from django.db.models import Window
from django.db.models import Avg, F


@method_decorator(never_cache, name='dispatch')
class HomeView(LoginRequiredMixin, UserPassesTestMixin, ListView):
    queryset = Product.objects.all()
    context_object_name = 'products'
    template_name = 'pages/home.html'

    def test_func(self):
        return any([
            getattr(self.request.user, 'is_superuser'),
            getattr(self.request.user, 'is_staff')
        ])

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

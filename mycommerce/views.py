from django.db.models import Avg, Case, Count, F, Q, When
from django.db.models.aggregates import Count
from django.db.models.functions import Coalesce
from django.shortcuts import render
from django.utils.translation import get_language_from_request
from django.views.generic import TemplateView
from django.db import models
from shop.models import Product


class HomeView(TemplateView):
    template_name = 'pages/home.html'


class TestPage(TemplateView):
    def get(self, request, *args, **kwargs):
        products = Product.objects.all()
        product = Product.objects
        return render(request, 'pages/test_page.html', context={'product': product, 'products': products})


# def handler404(request, *args, **kwargs):
#     result = re.match(r'(?:fr|en|es)\/products\/\d+\/[a-z-]+', request.path)
#     print(result)
#     if result:
#         print(result)
#         # return product_page(request)
#     return render(request, '404.html')


# def handler500(request, *args, **kwargs):
#     return render(request, '500.html')

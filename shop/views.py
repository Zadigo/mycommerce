from django.shortcuts import render
from django.views.generic import DetailView, TemplateView

from shop.models import Product

# class ProductView(TemplateView):
#     template_name = 'index.html'


class ProductView(DetailView):
    model = Product
    queryset = Product.objects.filter(active=True)
    template_name = 'product.html'
    context_object_name = 'product'
    
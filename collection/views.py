import json

from django.db.models.functions import Lower
from django.http.response import Http404
from django.shortcuts import render
from django.views.generic import DetailView, ListView, View

from collection.models import Collection


class CollectionsView(ListView):
    """List of collections available on
    the current shop"""

    model = Collection
    context_object_name = 'collections'
    queryset = Collection.objects.all()
    template_name = 'collections.html'

    # @method_decorator(cache_page(60 * 15))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)


# class CollectionView(TemplateView):
#     """Show the products present in a
#     given collection"""

#     template_name = 'index.html'


class CollectionView(DetailView):
    """Shows all the sub-categories of a
    given collection (using the categories
    of the products)"""

    model = Collection
    pk_url_kwarg = 'slug'
    slug_url_kwarg = 'sub_category'
    context_object_name = 'collection'
    queryset = Collection.objects.all()
    template_name = 'collection.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        collection = self.get_object()
        categories_queryset = collection.products.annotate(
            lowered_category=Lower('category')
        )
        categories = categories_queryset.values_list(
            'lowered_category',
            flat=True
        )
        context['categories'] = list(set(categories))
        return context

    def get_object(self, queryset=None):
        if queryset is None:
            queryset = self.get_queryset()

        collection_slug = self.kwargs.get('slug')

        if collection_slug is None:
            raise AttributeError(("Generic detail view must be called"
                                  "with both a slug and sub-category"))

        queryset = queryset.filter(slug=collection_slug)

        try:
            obj = queryset.get()
        except:
            raise Http404("Collection does not exist")
        return obj


class CollectionSubcategoryView(View):
    """Shows the products available under
    the given sub-category"""

    model = Collection
    queryset = Collection.objects.all()

    def get(self, request, *args, **kwargs):
        collection = self.get_object()
        sub_category = self.kwargs.get('sub_category')

        if sub_category is None:
            raise ValueError()

        products = collection.products.filter(
            active=True,
            category=sub_category.title()
        )
        context = self.get_context_object(products=products)
        return render(request, 'collection_subcategory.html', context)

    def get_context_object(self, **kwargs):
        collection = self.get_object()

        products = kwargs.get('products')
        if products is None:
            products = collection.products

        serialized_products = json.dumps(list(products.values('id', 'name')))
        context = {
            'collections': self.queryset,
            'collection': collection,
            'serialized_products': serialized_products
        }
        return context | kwargs

    def get_object(self):
        slug = self.kwargs.get('slug')

        if slug is None:
            raise AttributeError()

        queryset = self.queryset.filter(slug=slug)
        try:
            obj = queryset.get()
        except:
            raise Http404('Collection does not exist')
        return obj

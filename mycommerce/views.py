import re
from urllib.parse import urlunparse

from django.contrib.sites.shortcuts import get_current_site
from django.shortcuts import redirect, render
from django.urls import reverse
from django.utils.translation import get_language_from_request


def product_page(request):
    # fr/products/26/bandeau-reversible
    redirect_path = reverse('home')
    site = get_current_site(request)
    print(site)
    return redirect(redirect_path + f'?redirect=true&product={26}')    


def index_view(request, **kwargs):
    language = get_language_from_request(request)
    return render(request, 'index.html', {})


# def handler404(request, *args, **kwargs):
#     result = re.match(r'(?:fr|en|es)\/products\/\d+\/[a-z-]+', request.path)
#     print(result)
#     if result:
#         print(result)
#         # return product_page(request)
#     return render(request, '404.html')


# def handler500(request, *args, **kwargs):
#     return render(request, '500.html')

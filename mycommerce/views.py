from django.shortcuts import render
from django.utils.translation import get_language_from_request
from django.views.generic import TemplateView


class HomeView(TemplateView):
    template_name = 'pages/home.html'


# def handler404(request, *args, **kwargs):
#     result = re.match(r'(?:fr|en|es)\/products\/\d+\/[a-z-]+', request.path)
#     print(result)
#     if result:
#         print(result)
#         # return product_page(request)
#     return render(request, '404.html')


# def handler500(request, *args, **kwargs):
#     return render(request, '500.html')

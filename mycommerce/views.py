from django.shortcuts import render
from django.utils.translation import get_language_from_request


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

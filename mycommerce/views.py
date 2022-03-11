from django.shortcuts import render
from django.utils.translation import get_language_from_request

def index_view(request, **kwargs):
    language = get_language_from_request(request)
    return render(request, 'index.html', {})

from django.shortcuts import render

def index_view(request, **kwargs):
    return render(request, 'index.html', {})

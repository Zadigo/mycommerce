from collections import OrderedDict

from django.db.models import Q
from rest_framework.response import Response

from mystore.responses import CustomPagination


class CustomProductPagination(CustomPagination):
    default_limit = 100
    max_limit = 100

    def get_paginated_response(self, data, **kwargs):
        return Response(OrderedDict([
            ('count', self.count),
            ('infos', kwargs.get('additional_infos')),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data)
        ]))


def products_filering_helper(request, queryset):
    # Since we receive the query as
    # [a,b,c] string, we need to parse
    # the different elements
    def split_incoming_query(items) -> list:
        try:
            text = items[-1]
        except:
            return []
        else:
            tokens = text.split(',')
            return list(map(lambda x: x.title(), tokens))

    sizes = request.GET.getlist('sizes', [])
    colors = request.GET.getlist('colors', [])
    # brand = request.GET.get('brand', [])
    # cut = request.GET.get('cut', [])
    # material = request.GET.get('material', [])
    # season = request.GET.get('season', [])
    # delivery = request.GET.get('season', False)
    novelties = request.GET.get('novelties', False)
    logic = (
        Q(color__in=split_incoming_query(colors)) |
        Q(size__name__in=split_incoming_query(sizes)) |
        Q(display_new=novelties)
    )
    return queryset.filter(logic)


def build_colors(colors):
    def build_color(name):
        return {'name': name, 'image': f"/media/{name.lower()}.png"}
    return map(build_color, colors)

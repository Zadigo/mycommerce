from typing import OrderedDict, Tuple

from django.db.models.functions import Lower
from django.shortcuts import get_object_or_404, render
from rest_framework.decorators import api_view
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from rest_framework.viewsets import GenericViewSet
from shop.models import Product
from shop.serializers import ProductSerializer

from collection.models import Collection
from collection.serializers import CollectionSerializer


class CustomPagination(LimitOffsetPagination):
    default_limit = 100
    
    def get_response_dict(self, data) -> dict:
        return OrderedDict([
            ('count', self.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data)
        ])
    
    
def paginate_data(request, queryset, serializer, has_many=False) -> Tuple[CustomPagination, Serializer, Response]:
    instance = CustomPagination()
    result = instance.paginate_queryset(queryset, request)
    serializer_instance = serializer(instance=result, many=has_many)
    response = instance.get_paginated_response(serializer_instance.data)
    return instance, serializer_instance, response


@api_view(['get'])
def collecion_view(request, name, **kwargs):
    if name == 'all':
        queryset = Product.objects.filter(active=True)
        _, _, response = paginate_data(request, queryset, ProductSerializer, has_many=True)
        return response
        
    collection = get_object_or_404(Collection, name__iexact=name)
    serializer = CollectionSerializer(instance=collection)
    
    collection_data = serializer.data
    products = Product.objects.filter(collection__name__iexact=name, active=True)
    instance, serializer_instance, _ = paginate_data(request, products, ProductSerializer, has_many=True)
    paginated_products = instance.get_response_dict(serializer_instance.data)
    data_to_return = {**paginated_products, **collection_data}
    data_to_return['infos'] = {
        'total_count': products.count()
    }
    return Response(data=data_to_return)


# @api_view(['get'])
# def product_by_collection(request, collection, **kwargs):
#     products = Product.objects.filter(collection__name__eq='Some name')
#     serializer = ProductSerializer(instance=products, many=True)
#     return responses.success_response(serializer=serializer)

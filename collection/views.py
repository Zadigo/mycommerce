from django.db.models.expressions import Q
from django.shortcuts import get_object_or_404, render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from shop.models import Product
from shop.serializers import ProductSerializer

from collection.models import Collection
from collection.serializers import CollectionSerializer, paginate_data


@api_view(['get'])
def collecion_view(request, name, **kwargs):
    if name == 'all':
        queryset = Product.objects.filter(active=True)
        _, _, response = paginate_data(request, queryset, ProductSerializer, has_many=True)
        return response
        
    collection = get_object_or_404(Collection, name__iexact=name)
    serializer = CollectionSerializer(instance=collection)
    # Since it's kinda complicated to paginate the
    # nested products, we integrate afterwards after
    # having serialized the collection
    collection_data = serializer.data
    
    products = Product.objects.filter(collection__name__iexact=name, active=True).order_by('-created_on')
    instance, serializer_instance, _ = paginate_data(request, products, ProductSerializer, has_many=True)
    paginated_products = instance.get_response_dict(serializer_instance.data)
    
    data_to_return = {**paginated_products, **collection_data}
    data_to_return['infos'] = {
        'total_count': products.count()
    }
    return Response(data=data_to_return)

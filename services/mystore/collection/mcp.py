from mcp_server import ModelQueryToolset
from collection.models import Collection



class CollectionQueryTool(ModelQueryToolset):
    model = Collection
    search_fields = [
        'name',
        'category',
        'sub_category',
        'description',
        'products',
        'illustration',
        'tags',
        'slug',
        'subcategory_slug',
        'created_on'
    ]

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.select_related('product')


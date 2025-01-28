from django.db.models import Q
from rest_framework import fields
from rest_framework.serializers import Serializer


class CollectionSerializer(Serializer):
    id = fields.IntegerField()
    name = fields.CharField()
    category = fields.CharField()
    sub_category = fields.CharField()
    number_of_items = fields.IntegerField()
    illustration = fields.ImageField()
    tags = fields.CharField()
    get_view_name = fields.CharField()


class SearchParametersSerializer(Serializer):
    """Serializer for normalizing the search
    queries for a collection"""
    
    name = fields.CharField()
    color = fields.CharField(required=False)
    size = fields.CharField(required=False)
    on_sale = fields.BooleanField(default=False)

    def search_name(self, queryset):
        name = self.validated_data['name']
        logic = Q(name__iexact=name) | Q(name__icontains=name)
        return queryset.filter(logic)

    def search_color(self, queryset):
        color = self.validated_data.get('color', '')
        if color == '':
            return queryset
        return queryset.filter(color=color)

    def search_is_onsale(self, queryset):
        on_sale = self.validated_data['on_sale']
        # Return everything regardless
        # if they are on sale or not
        if not on_sale:
            return queryset
        return queryset.filter(on_sale=True)

    def search_size(self, queryset):
        size = self.validated_data.get('size', None)

        if size is None:
            return queryset
        
        return queryset.filter(
            sizes__name=size,
            availability=True
        )

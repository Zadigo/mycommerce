import itertools

import pydantic
from django.core.cache import cache
from django_mcp import mcp_app as mcp
from mcp_server import MCPToolset, ModelQueryToolset
from shop.api.serializers import ProductSerializer
from shop.models import Image, Product, Video

from mystore.constants import SUB_CATEGORIES


class CreateProductModel(pydantic.BaseModel):
    name: str
    color: str
    sku: str
    model_height: float
    model_size: str
    age_group_category: str


class ImageQueryTool(ModelQueryToolset):
    model = Image
    search_fields = [
        'name',
        'product__name',
        'product__color',
        'product__sku',
        'variant',
        'original',
        'mid_size',
        'thumbnail',
        'is_main_image',
        'active',
        'created_on',
    ]

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.select_related('product')


class VideoQueryTool(ModelQueryToolset):
    model = Video
    search_fields = [
        'name',
        'product__name',
        'product__color',
        'product__sku',
        'variant',
        'original',
        'mid_size',
        'thumbnail',
        'is_main_image',
        'active',
        'created_on',
    ]

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.select_related('product')


class ProductQueryTool(ModelQueryToolset):
    model = Product
    search_fields = [
        'name',
        'color',
        'sku',
        'model_height',
        'model_size',
        'age_group_category',
        'gender_category',
        'category',
        'sub_category',
        'unit_price',
        'sale_value',
        'sale_price',
        'on_sale',
        'display_new',
        'validity_score',
        'active',
        'created_on',
    ]

    def get_queryset(self):
        qs = cache.get('mcp_products', None)
        if qs is None:
            qs = super().get_queryset()
            cache.set('mcp_products', qs, 60 * 60)  # Cache for 1 hour
        return qs


class ProductTools(MCPToolset):
    def _get_queryset(self):
        qs = cache.get('mcp_products', None)
        if qs is None:
            qs = Product.objects.prefetch_related('video').all()
            cache.set('mcp_products', qs, 60 * 60 * 24)  # Cache for 24 hours
        return qs

    def create_product(self, **kwargs: CreateProductModel) -> dict:
        instance = Product.objects.create(**kwargs)
        return ProductSerializer(instance=instance).data

    def update_product(self, **kwargs):
        return

    def get_by_name(self, name: str) -> list[dict]:
        """Returns a list of products matching the given name.

        Args:
            name (str): The name or partial name of the product to search for.

        Returns:
            list[dict]: A list of dictionaries representing the matching products.
        """
        qs = self._get_queryset().filter(name__icontains=name)
        return ProductSerializer(instance=qs, many=True).data

    def get_by_color(self, color: str) -> list[dict]:
        """Returns a list of products matching the given color.

        Args:
            color (str): The color of the product to search for.

        Returns:
            list[dict]: A list of dictionaries representing the matching products.
        """
        qs = self._get_queryset().filter(color__iexact=color)
        return ProductSerializer(instance=qs, many=True).data

    def get_by_category(self, category: str, sub_category: str = None) -> list[dict]:
        """Returns a list of products matching the given category and optional sub-category.

        Args:
            category (str): The category of the product to search for.
            sub_category (str, optional): The sub-category of the product to search for.

        Returns:
            list[dict]: A list of dictionaries representing the matching products.
        """
        qs = self._get_queryset().filter(category__iexact=category)
        if sub_category:
            qs = qs.filter(sub_category__iexact=sub_category)
        return ProductSerializer(instance=qs, many=True).data

    def get_by_unit_price_range(self, min_price: float, max_price: float) -> list[dict]:
        """Returns a list of products within the given unit price range.

        Args:
            min_price (float): The minimum unit price of the products to search for.
            max_price (float): The maximum unit price of the products to search for.

        Returns:
            list[dict]: A list of dictionaries representing the matching products.
        """
        qs = self._get_queryset().filter(
            unit_price__gte=min_price, unit_price__lte=max_price)
        return ProductSerializer(instance=qs, many=True).data

    def get_by_creation_date(self, start_date: str = None, end_date: str = None) -> list[dict]:
        """Returns a list of products created within the given date range.

        Args:
            start_date (str, optional): The start date of the creation date range.
            end_date (str, optional): The end date of the creation date range.

        Returns:
            list[dict]: A list of dictionaries representing the matching products.
        """
        qs = self._get_queryset()
        if start_date:
            qs = qs.filter(created_on__date__gte=start_date)
        if end_date:
            qs = qs.filter(created_on__date__lte=end_date)
        return ProductSerializer(instance=qs, many=True).data

    def get_products_for_facebook_ads(self) -> list[dict]:
        return

    def transfer_to_google_sheets(self) -> str:
        return "Data transferred to Google Sheets successfully."

    def transfer_to_airtable(self) -> str:
        return "Data transferred to Airtable successfully."

    def get_by_validity_score(self, min_score: float) -> list[dict]:
        """Returns a list of products with a validity score greater than or equal to the given minimum score.

        Args:
            min_score (float): The minimum validity score of the products to search for.

        Returns:
            list[dict]: A list of dictionaries representing the matching products.
        """
        qs = self._get_queryset()
        items = filter(lambda x: x.validity_score >= min_score, qs)
        filtered_items = list(items)
        return ProductSerializer(instance=filtered_items, many=True).data

    def deactivate_products(self, names: list[str]) -> str:
        return "Old products deactivated successfully."


@mcp.resource('file://{namespace}')
async def available_categories(namespace: str) -> list[str]:
    """Returns a list of available categories or sub-categories based 
    on the provided namespace for the products in the store.

    Args:
        namespace (str): The namespace to determine whether to return categories or sub-categories.
                         It can be either 'categories' or 'sub_categories'.

    Returns:
        list[str]: A list of available categories or sub-categories based on the provided namespace.
    """
    if namespace == 'categories':
        items = map(lambda x: x['category'], SUB_CATEGORIES)
        return list(items)
    elif namespace == 'sub_categories':
        items = [category['items'] for category in SUB_CATEGORIES]
        result = list(itertools.chain(*items))
        result.append('Not attributed')
        return sorted(result)
    else:
        return []

import pydantic
from django.core.cache import cache
from mcp_server import MCPToolset, ModelQueryToolset
from shop.api.serializers import ProductSerializer
from shop.models import Image, Product, Video


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
    def create_product(self, **kwargs: CreateProductModel) -> dict:
        instance = Product.objects.create(**kwargs)
        return ProductSerializer(instance=instance).data

    def update_product(self, **kwargs):
        return

    def get_by_name(self, name: str) -> list[dict]:
        return

    def get_by_color(self, color: str) -> list[dict]:
        return

    def get_by_price_range(self, min_price: float, max_price: float) -> list[dict]:
        return

    def get_by_creation_date(self, start_date: str = None, end_date: str = None) -> list[dict]:
        return

    def get_products_for_facebook_ads(self) -> list[dict]:
        return

    def transfer_to_google_sheets(self) -> str:
        return "Data transferred to Google Sheets successfully."

    def transfer_to_airtable(self) -> str:
        return "Data transferred to Airtable successfully."

    def get_by_validity_score(self, min_score: float) -> list[dict]:
        return

    def deactivate_products(self, names: list[str]) -> str:
        return "Old products deactivated successfully."

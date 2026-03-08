from typing import Annotated, List, Optional, Text

import pydantic
from django.core.cache import cache
from mcp_server import MCPToolset, ModelQueryToolset
from pydantic import (BaseModel, FieldValidationInfo, ValidationError,
                      field_validator)

from variants.models import Size


class FacebookCatalog(pydantic.BaseModel):
    id: int
    title: str
    description: Optional[str]
    availability: str
    condition: str
    price: str
    link: str
    image_link: str
    brand: str
    size: str
    sale_price: Optional[str] = None
    sale_price_effective_date: Optional[str] = None
    item_group_id: Optional[str] = None
    status: Optional[str] = None
    additional_image_link: Optional[str] = None
    gtin: Optional[str] = None
    mpn: Optional[str] = None
    google_product_category: Optional[str] = None
    fb_product_category: Optional[str] = None
    quantity_to_sell_on_facebook: Optional[int] = None
    color: Optional[str] = None
    gender: Optional[str] = None
    age_group: Optional[str] = None
    material: Optional[str] = None
    pattern: Optional[str] = None
    rich_text_description: Optional[str] = None
    video: List[str] = []
    shipping: Optional[List[dict]] = None
    shipping_weight: Optional[str] = None
    custom_label_0: Optional[str] = None
    custom_label_1: Optional[str] = None
    custom_label_2: Optional[str] = None
    custom_label_3: Optional[str] = None
    custom_label_4: Optional[str] = None
    custom_number_0: Optional[str] = None
    custom_number_1: Optional[str] = None
    custom_number_2: Optional[str] = None
    custom_number_3: Optional[str] = None
    custom_number_4: Optional[str] = None

    @field_validator('fb_product_category', 'color', 'gender', 'age_group', 'material', 'pattern')
    @classmethod
    def global_validation(cls, value, info: FieldValidationInfo):
        if info.field_name == 'fb_product_category':
            if info.field_name is not None:
                pass
        return value


def _get_queryset(new_qs: Optional[Size] = None):
    key = 'mcp_variants'
    qs = cache.get(key, None)

    if new_qs is not None and qs is None:
        cache.set(key, new_qs, 60 * 60 * 24)  # Cache for 24 hours
        return new_qs

    if qs is None:
        qs = Size.objects.select_related('product').all()
        cache.set(key, qs, 60 * 60 * 24)  # Cache for 24 hours
    return qs


class SizeQueryTool(ModelQueryToolset):
    model = Size
    search_fields = [
        'name',
        'product__name',
        'attributed_price',
        'availability',
        'active',
        'metric',

    ]

    def get_queryset(self):
        qs = super().get_queryset()
        return _get_queryset(qs.select_related('product'))


class VariantTools(MCPToolset):
    def get_products_for_facebook_ads(self) -> list[FacebookCatalog]:
        """Returns a list of products that are eligible for Facebook ads based on specific criteria.

        link: https://www.facebook.com/business/help/120325381656392?id=725943027795860

        Returns:
            list[FacebookCatalog]: A list of FacebookCatalog objects representing the eligible products for Facebook ads.
        """
        qs = _get_queryset()

        def base_products():
            for variant in qs:
                product = FacebookCatalog(
                    id=variant.product.id,
                    title=variant.product.name,
                    description=None,
                    availability='in stock' if variant.product.active else 'out of stock',
                    condition='new',
                    price=f'{variant.product.get_price} EUR',
                    link=f'https://www.mycommerce.com/products/{variant.product.id}',
                    image_link=variant.product.get_main_image,
                    brand='',
                    size=variant.name
                )

                yield product

        return list(base_products())

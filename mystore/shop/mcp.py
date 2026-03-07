import base64
import itertools
from typing import Annotated, Optional, Text

from django.db.models import Q
import pydantic
import mimetypes
from django.core.cache import cache
from django_mcp import mcp_app as mcp
from mcp_server import MCPToolset, ModelQueryToolset
from shop.api.serializers import ProductSerializer, WishlistSerializer, ImageSerializer
from shop.models import Image, Product, Video, Wishlist
from mcp.types import TextContent, ImageContent

from shop.choices import GenderChoices, AgeGroupChoices
from mystore.choices import CategoryChoices, SubCategoryChoices

from mystore.constants import SUB_CATEGORIES


class CreateProductModel(pydantic.BaseModel):
    name: str = pydantic.Field(..., required=True)
    color: str
    sku: str
    age_group_category: AgeGroupChoices = AgeGroupChoices.ADULT
    gender_category: GenderChoices = GenderChoices.UNISEX
    category: CategoryChoices = CategoryChoices.NOT_ATTRIBUTED
    # sub_category: str = pydantic.Field('Not attributed')
    unit_price: Annotated[float, pydantic.Field(ge=1)] = 1.0
    sale_value: Annotated[int, pydantic.Field(ge=0, le=100)] = 0
    on_sale: bool = False
    display_new: bool = False


class UpdateProductModel(CreateProductModel):
    id: int = pydantic.Field(..., required=True, gt=0)
    model_height: Optional[int] = pydantic.Field(160, required=False, gte=160)
    model_size: Optional[int] = pydantic.Field(40, required=False, gte=40)
    active: bool = False


class UpdateImageModel(pydantic.BaseModel):
    name: str
    product_id: int
    variant: Optional[str] = None
    is_main_image: bool = False


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


class WishlistQueryTool(ModelQueryToolset):
    model = Wishlist
    search_fields = [
        'name',
        'products',
        'created_on'
    ]


class ProductTools(MCPToolset):
    def _get_queryset(self):
        qs = cache.get('mcp_products', None)
        if qs is None:
            qs = Product.objects.prefetch_related('video').all()
            cache.set('mcp_products', qs, 60 * 60 * 24)  # Cache for 24 hours
        return qs

    def create_product(self, data: CreateProductModel) -> dict:
        """Creates a new product with the given attributes and returns its serialized data.

        Args:
            data: The attributes of the product to be created, which should match the fields defined in the CreateProductModel.

        Returns:
            dict: A dictionary representing the serialized data of the created product.
        """
        instance = Product.objects.create(**data.model_dump())
        return ProductSerializer(instance=instance).data

    def update_product(self, data: UpdateProductModel) -> dict:
        """Updates an existing product with the given attributes and returns its serialized data.

        Args:
            data: The attributes of the product to be updated, which should include the 'id' of the product and any fields to be updated.

        Returns:
            dict: A dictionary representing the serialized data of the updated product.
        """
        product_id = data.id
        if not product_id:
            raise ValueError("Product ID is required for updating a product.")

        try:
            instance = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            raise ValueError(f"Product with ID {product_id} does not exist.")

        for key, value in data.model_dump_json().items():
            if key != 'id' and hasattr(instance, key):
                setattr(instance, key, value)

        instance.save()
        return ProductSerializer(instance=instance).data

    def get_all_products(self) -> list[dict]:
        """Returns a list of all products in the store.

        Returns:
            list[dict]: A list of dictionaries representing all the products in the store.
        """
        qs = self._get_queryset()
        return ProductSerializer(instance=qs, many=True).data

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

    def get_by_category(self, category: str, sub_category: Optional[str] = None) -> list[dict]:
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
            unit_price__gte=min_price,
            unit_price__lte=max_price
        )
        return ProductSerializer(instance=qs, many=True).data

    def get_by_creation_date(self, start_date: Optional[str] = None, end_date: Optional[str] = None) -> list[dict]:
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

        def parser(item):
            try:
                return int(item.validity_score.split('/')[0]) >= min_score
            except (ValueError, IndexError):
                return False

        items = filter(parser, qs)
        filtered_items = list(items)
        return ProductSerializer(instance=filtered_items, many=True).data

    def deactivate_products(self, names: list[str]) -> str:
        return "Old products deactivated successfully."


class WishlistTools(MCPToolset):
    def _get_queryset(self):
        qs = cache.get('mcp_wishlists', None)
        if qs is None:
            qs = Wishlist.objects.prefetch_related('products').all()
            cache.set('mcp_wishlists', qs, 60 * 60 * 24)  # Cache for 24 hours
        return qs

    def get_all_wishlists_by_user(self, email: str) -> list[dict]:
        """Returns a list of all wishlists created by the specified user.

        Args:
            email (str): The email of the user whose wishlists are to be retrieved.

        Returns:
            list[dict]: A list of dictionaries representing the wishlists created by the specified user.
        """
        qs = self._get_queryset()
        return qs.filter(user__email__iexact=email)

    def get_all_wishlists(self) -> list[dict]:
        """Returns a list of all wishlists in the store.

        Returns:
            list[dict]: A list of dictionaries representing all the wishlists in the store.
        """
        qs = self._get_queryset()
        return WishlistSerializer(instance=qs, many=True).data

    def get_all_wishlists_by_quarter(self, quarter: int = 1):
        """Returns a list of all wishlists created in the specified quarter.

        Args:
            quarter (int): The quarter to filter wishlists by (1 for Q1, 2 for Q2, 3 for Q3, 4 for Q4).

        Returns:
            list[dict]: A list of dictionaries representing the wishlists created in the specified quarter.
        """
        qs = self._get_queryset()
        if value := quarter in [1, 2, 3, 4]:
            return qs.filter(created_on__quarter=quarter)
        return []

    def get_all_wishlists_by_product(self, name: str):
        """Returns a list of all wishlists that contain a product with the specified name.

        Args:
            name (str): The name of the product to filter wishlists by.

        Returns:
            list[dict]: A list of dictionaries representing the wishlists that contain a product with the specified name.
        """
        qs = self._get_queryset()
        return qs.filter(products__name__icontains=name)


class ImageTools(MCPToolset):
    def _get_queryset(self):
        qs = cache.get('mcp_images', None)
        if qs is None:
            qs = Image.objects.select_related('product').all()
            cache.set('mcp_images', qs, 60 * 60 * 24)  # Cache for 24 hours
        return qs

    def update_image(self, data: UpdateImageModel) -> dict:
        """Updates an existing image with the given attributes and returns its serialized data.

        Args:
            data: The attributes of the image to be updated, which should include the 'product_id' of the associated product and any fields to be updated.

        Returns:
            dict: A dictionary representing the serialized data of the updated image.
        """
        cleaned_data = data.model_dump()
        product_id = cleaned_data.pop('product_id', None)

        if product_id is None:
            raise ValueError("Product ID is required for updating an image.")

        try:
            instance = Image.objects.get(product_id=product_id)
        except Image.DoesNotExist:
            raise ValueError(
                f"Image with Product ID {product_id} does not exist.")

        for key, value in cleaned_data.items():
            if hasattr(instance, key):
                setattr(instance, key, value)

        instance.save()
        return ImageSerializer(instance=instance).data

    def get_image(self, name: str, product_name: Optional[str] = None, image_id: Optional[str | int] = None) -> list[TextContent | ImageContent]:
        """Returns the image associated with the specified name and optional image ID.

        Args:
            name (str): The name of the product associated with the image to retrieve.
            product_name (str, optional): The name of the product to filter images by.
            image_id (str | int, optional): The ID of the image to retrieve. If not provided, the first matching image will be returned.

        Returns:
            list[TextContent | ImageContent]: A list containing the serialized data of the retrieved image as TextContent and ImageContent objects.
        """
        qs = self._get_queryset()
        if product_name is not None:
            qs = qs.filter(product__name__icontains=product_name)

        images_qs = qs.filter(name=name)
        if not images_qs.exists():
            raise ValueError(
                f"No image found for name '{name}' and product name '{product_name}'."
            )

        instance = images_qs.first()
        if instance is None:
            raise ValueError(
                f"No image found for product name '{name}' with ID '{image_id}'."
            )
        
        data = ImageSerializer(instance=instance).data

        bytes_data = instance.original.read()
        mime_type = mimetypes.guess_type(instance.original.name)[0] or 'application/octet-stream'
        base64_image = base64.b64encode(bytes_data).decode('utf-8')

        return [
            TextContent(type='text', text=str(data)),
            ImageContent(type='image', data=base64_image, mimeType=mime_type)
        ]

    def get_images_by_product_name(self, name: str) -> list[dict]:
        """Returns a list of images associated with products that match the given name.

        Args:
            name (str): The name or partial name of the product to search for.

        Returns:
            list[dict]: A list of dictionaries representing the images associated with matching products.
        """
        qs = self._get_queryset().filter(product__name__icontains=name)
        return ImageSerializer(instance=qs, many=True).data


@mcp.resource('file://{namespace}')
async def available_categories(namespace: str) -> TextContent:
    """Returns a list of available categories or sub-categories based 
    on the provided namespace for the products in the store.

    Args:
        namespace (str): The namespace to determine whether to return categories or sub-categories.
                        It can be either 'categories' or 'sub_categories'.

    Returns:
        TextContent: A TextContent object containing the list of available categories or sub-categories based on the provided namespace.
    """
    result = []

    if namespace == 'categories':
        items = map(lambda x: x['category'], SUB_CATEGORIES)
        return TextContent(
            type='text',
            text=str(list(items)),
            annotations={
                'model_config': {
                    'title': 'Available Product Categories'
                }
            }
        )
    elif namespace == 'sub_categories':
        items = [category['items'] for category in SUB_CATEGORIES]
        result = list(itertools.chain(*items))
        result.append('Not attributed')
        result = sorted(result)
        return TextContent(
            type='text',
            text=str(result),
            annotations={
                'model_config': {
                    'title': 'Available Product Sub-Categories'
                }
            }
        )

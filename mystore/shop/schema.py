import graphene
from django.core.cache import cache
from graphene import relay
from graphene_django import DjangoObjectType
from shop.models import Image, Novelty, Product, Sale, Video


class ImageType(DjangoObjectType):
    thumbnail = graphene.String()
    original = graphene.String()

    class Meta:
        model = Image
        fields = [
            'name', 'variant', 'original',
            'mid_size', 'thumbnail', 'is_main_image',
            'created_on'
        ]

    def resolve_original(self, info):
        print(self.original.url)
        return self.original.url

    def resolve_thumbnail(self, info):
        return self.thumbnail.url


class VideoType(DjangoObjectType):
    content = graphene.String()

    class Meta:
        model = Video
        fields = ['name', 'content', 'created_on']

    def resolve_content(self, info):
        return self.content.url


class ProductType(DjangoObjectType):
    category = graphene.String()
    # is_new = graphene.Boolean()
    has_sizes = graphene.Boolean()
    main_image = graphene.Field(ImageType, source='get_main_image')
    price = graphene.Float(source='get_price')
    unit_price = graphene.Float()
    sale_price = graphene.Float()
    model_height = graphene.Int()

    class Meta:
        model = Product
        interfaces = (relay.Node,)
        filter_fields = {
            'name': ['exact', 'icontains', 'istartswith'],
            'color': ['exact', 'icontains', 'istartswith'],
            'sku': ['exact'],
            'gender_category': ['exact'],
            'category': ['exact'],
            'sub_category': ['exact'],
            'unit_price': ['exact', 'lt', 'gt'],
            'sale_value': ['exact', 'lt', 'gt'],
            'sale_price': ['exact', 'lt', 'gt'],
            'on_sale': ['exact'],
            'display_new': ['exact'],
            'slug': ['exact'],
            # 'is_new': ['exact'],
            'get_price': ['exact', 'lt', 'gt'],
            'has_sizes': ['exact'],
        }

    @classmethod
    def get_queryset(cls, queryset, info):
        return queryset.filter(active=True)


class ProductNoveltyType(DjangoObjectType):
    class Meta:
        model = Novelty
        interfaces = (relay.Node,)
        filter_fields = {
            'name': ['exact', 'icontains', 'istartswith'],
            'color': ['exact', 'icontains', 'istartswith'],
            'sku': ['exact'],
            'gender_category': ['exact'],
            'category': ['exact'],
            'sub_category': ['exact'],
            'unit_price': ['exact', 'lt', 'gt'],
            'sale_value': ['exact', 'lt', 'gt'],
            'sale_price': ['exact', 'lt', 'gt'],
            'on_sale': ['exact'],
            'display_new': ['exact'],
            'slug': ['exact'],
            'is_new': ['exact'],
            'get_price': ['exact', 'lt', 'gt'],
            'has_sizes': ['exact'],
        }


class ProductConnection(relay.Connection):
    class Meta:
        node = ProductType


class ProductNoveltyConnection(relay.Connection):
    class Meta:
        node = ProductNoveltyType


class ProductQuery(graphene.ObjectType):
    product = relay.Node.Field(ProductType)
    all_products = relay.ConnectionField(ProductConnection)

    search_products = relay.ConnectionField(
        ProductConnection,
        name=graphene.String(),
        sku=graphene.String(),
        color=graphene.String(),
        unit_price=graphene.Float(),
        sale_value=graphene.Float(),
        slug=graphene.String()
    )

    products_by_category = relay.ConnectionField(
        ProductConnection,
        name=graphene.String(required=True),
        min_price=graphene.Float(required=False),
        max_price=graphene.Float(required=False)
    )

    all_images = graphene.List(ImageType)
    all_videos = graphene.List(VideoType)

    product_novelty = relay.Node.Field(ProductNoveltyType)
    all_product_novelties = relay.ConnectionField(ProductNoveltyConnection)

    def resolve_all_products(self, info, **kwargs):
        qs = cache.get('allProducts')
        if not qs:
            qs = Product.objects.prefetch_related('product_images', 'video').all()
            cache.set('allProducts', qs, 60*15)  # Cache for 15 minutes
        return qs

    def resolve_all_product_novelties(self, info, **kwargs):
        return Novelty.objects.all()

    def resolve_search_products(self, info, **kwargs):
        name = kwargs.get('name')
        sku = kwargs.get('sku')
        color = kwargs.get('color')
        unit_price = kwargs.get('unit_price')
        sale_value = kwargs.get('sale_value')
        slug = kwargs.get('slug')

        filter_args = {}

        if name:
            filter_args['name__icontains'] = name

        if sku:
            filter_args['sku__exact'] = sku

        if color:
            filter_args['color__icontains'] = color

        if unit_price is not None:
            filter_args['unit_price__exact'] = unit_price

        if sale_value is not None:
            filter_args['sale_value__exact'] = sale_value

        if slug:
            filter_args['slug__exact'] = slug

        cache_key = '_'.join(filter_args.keys())
        qs = cache.get('searchProducts_' + cache_key)

        if qs is None:
            qs = Product.objects.filter(**filter_args)
            cache.set('searchProducts_' + cache_key,
                      qs, 60*10)  # Cache for 10 minutes

        return qs

    def resolve_all_images(self, info, **kwargs):
        return Image.objects.all()

    def resolve_products_by_category(self, info, name, min_price=None, max_price=None, **kwargs):
        cache_key = f'productsByCategory_{name}'
        qs = cache.get(cache_key)

        if qs is None:
            qs = Product.objects.prefetch_related('product_images', 'video').filter(category__iexact=name)
            cache.set(cache_key, qs, 60*10)  # Cache for 10 minutes

        if min_price is not None:
            qs = qs.filter(unit_price__gte=min_price)

        return qs

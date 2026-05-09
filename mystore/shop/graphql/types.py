import graphene
from graphene import relay
from graphene_django import DjangoObjectType
from mystore.shop.models import Image, Novelty, Product, Video



class ImageType(DjangoObjectType):
    thumbnail = graphene.String()
    original = graphene.String()

    class Meta:
        model = Image
        fields = '__all__'

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
    color_variants = graphene.List(lambda: ProductType)

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

    def resolve_color_variants(self, info):
        return Product.objects.filter(name=self.name).exclude(id=self.id)


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


class RecommendationsType(DjangoObjectType):
    category = graphene.String()
    # is_new = graphene.Boolean()
    has_sizes = graphene.Boolean()
    main_image = graphene.Field(ImageType, source='get_main_image')
    price = graphene.Float(source='get_price')
    unit_price = graphene.Float()
    sale_price = graphene.Float()
    model_height = graphene.Int()
    color_variants = graphene.List(lambda: ProductType)

    class Meta:
        model = Product
        fields = '__all__'


class ProductConnection(relay.Connection):
    class Meta:
        node = ProductType


class ProductNoveltyConnection(relay.Connection):
    class Meta:
        node = ProductNoveltyType



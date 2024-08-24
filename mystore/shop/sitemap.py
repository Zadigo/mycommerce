from django.contrib.sitemaps import Sitemap

from shop.models import Product


class ProductSitemap(Sitemap):
    changefreq = 'daily'
    priority = 1

    def items(self):
        return Product.objects.filter(
            active=True
        )

    def location(self, item):
        return item.get_absolute_url()

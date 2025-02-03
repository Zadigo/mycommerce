from django.contrib.sitemaps import Sitemap

from collection.models import Collection


class CollectionSitemap(Sitemap):
    changefreq = 'daily'
    priority = 1

    def items(self):
        return Collection.objects.all()

    def location(self, item):
        return item.get_absolute_url()

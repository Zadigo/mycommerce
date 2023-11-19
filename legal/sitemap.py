from django.contrib.sitemaps import Sitemap
from django.urls import reverse


class LegalSitemap(Sitemap):
    changefreq = 'yearly'
    priority = 0.5

    def items(self):
        return [
            'legal:privacy',
            'legal:use'
        ]

    def location(self, item):
        return reverse(item)

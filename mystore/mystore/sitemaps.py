from django.contrib.sitemaps import Sitemap

from collection import sitemap as collection_sitemaps
from legal import sitemap as legal_sitemap
from shop import sitemap as shop_sitemap

SITEMAPS = {
    'shop': shop_sitemap.ProductSitemap,
    'legal': legal_sitemap.LegalSitemap,
    'collections': collection_sitemaps.CollectionSitemap
}

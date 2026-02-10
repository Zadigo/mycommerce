<template>
  <section id="products-feed" class="my-10">
    <!-- Page Title -->
    <div id="feed-title" class="px-10">
      <volt-card class="shadow-none border-none p-1">
        <template #content>
          <div class="flex flex-row justify-start">
            <h1 class="uppercase font-bold text-2xl">
              {{ id }}
            </h1>
          </div>
        </template>
      </volt-card>
    </div>

    <!-- Feed -->
    <suspense>
      <template #default>
        <async-products-feed @modal:product-filters="toggleModal" />
      </template>

      <template #fallback>
        <products-loading-feed />
      </template>
    </suspense>

    <!-- Modals -->
    <client-only>
      <products-modals-filters :count="productsCount" />
    </client-only>
  </section>
</template>

<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import { useBusinessDetails } from '~/data'

const AsyncProductsFeed = defineAsyncComponent({
  loader: async () => import('~/components/products/Feed.vue'),
  delay: 1000,
  timeout: 3000,
})

const { t } = useI18n()
const { id } = useRoute().params

/**
 * Products
 */

const { products, productsCount, toggleModal } = await useProductsComposable()

/**
 * Schema
 */

const { get } = await useBusinessDetails()

useSeoMeta({
  title: useChangeCase(id as string, 'capitalCase'),
  description: t('Découvrez toutes notre collection de vêtements'),
  titleTemplate: `%s | ${get('legalName')}`,
  ogTitle: useChangeCase(id as string, 'capitalCase'),
  ogDescription: t('Découvrez toutes notre collection de vêtements'),
  ogImage: '/images/group1/img1.jpeg',
  twitterTitle: useChangeCase(id as string, 'capitalCase'),
  twitterDescription: t('Découvrez toutes notre collection de vêtements'),
  twitterImage: '/images/group1/img1.jpeg',
  twitterCard: 'summary_large_image',
  ogSiteName: get('legalName')
})

useSchemaOrg(products.value.map(x => defineProduct({
  "@type": 'Product',
  "@id": `https://example.com/products/${x.node.slug}`,
  name: x.node.name,
  sku: x.node.sku,
  image: x.node.productImages.map(image => image.original),
  url: `https://example.com/products/${x.node.slug}`,
  itemCondition: "https://schema.org/NewCondition",
  brand: {
    "@type": 'Brand',
    name: get('legalName'),
    logo: get('logo'),
  },
  offers: {
    price: x.node.price,
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    image: x.node.mainImage.original,
    shippingDetails: {
      "@type": 'OfferShippingDetails',
      shippingDestination: [
        { "@type": "DefinedRegion", addressCountry: 'FR' },
        { "@type": "DefinedRegion", addressCountry: 'GP' }
      ],
      deliveryTime: null
    }
  }
})))

defineOgImage({
  url: '/images/group1/img1.jpeg',
  width: 1200,
  height: 630,
  alt: t('Découvrez toutes notre collection de vêtements')
})
</script>

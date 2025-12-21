<template>
  <section id="products-feed" class="my-10">
    <!-- Page Title -->
    <!-- <div id="feed-title" class="px-10">
      <volt-card class="shadow-none border-none p-1">
        <template #content>
          <div class="flex flex-row justify-start">
            <h1 class="uppercase font-bold text-2xl">
              {{ id }}
            </h1>
          </div>
        </template>
      </volt-card>
    </div> -->

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
    <!-- <client-only>
      <products-modals-filters :count="productsCount" />
    </client-only > -->
  </section>
</template>

<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'

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

useSeoMeta({
  title: useChangeCase(id as string, 'capitalCase'),
  description: t('Découvrez toutes notre collection de vêtements'),
  titleTemplate: '%s | E-Woman'
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
    name: 'E-Woman',
    logo: 'https://example.com/image.png',
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
</script>

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
        <async-products-feed @products:list="handleLoadedProducts" @modal:product-filters="toggleModal" />
      </template>

      <template #fallback>
        <products-loading-feed />
      </template>
    </suspense>

    <!-- Modals -->
    <client-only>
      <products-modals-filters v-model="showModal" :count="productsCount" @update-products="handleUpdateProducts" />
    </client-only >
  </section>
</template>

<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import { useProvideProductsFilteringModal } from '~/composables/use'
import type { Product, ProductsApiResponse } from '~/types'

const AsyncProductsFeed = defineAsyncComponent({
  loader: async () => import('~/components/products/Feed.vue'),
  delay: 1000,
  timeout: 3000,
})

/**
 * Products
 */

const products = ref<Product[]>([])
const productsLoading = ref<boolean>(true)

const { t } = useI18n()
const { id } = useRoute().params

provide('productsLoading', productsLoading)

/**
 * Callback function used to set the products loaded
 * in the async component feed back to here
 * @param data The products to use
 */
function handleLoadedProducts(data: Product[]) {
  productsLoading.value = false
  products.value = data
}

/**
 * Returns a list of products based on the filters
 * that were provided by the user
 * @param data The filtered products
 */
function handleUpdateProducts(data: ProductsApiResponse) {
  console.log(data)
}

/**
 * Global injection state: Products filtering
 */

const { showModal, toggleModal } = useProvideProductsFilteringModal()

/**
 * Schema
 */

const productsCount = computed(() => products.value.length)

useSeoMeta({
  title: useChangeCase(id as string, 'capitalCase'),
  description: t('Découvrez toutes notre collection de vêtements'),
  titleTemplate: '%s | E-Woman'
})

useSchemaOrg(products.value.map(x => defineProduct({
  "@type": 'Product',
  "@id": `https://example.com/products/${x.slug}`,
  name: x.name,
  sku: x.sku,
  image: x.images?.map(image => image.original) ?? [],
  url: `https://example.com/products/${x.slug}`,
  itemCondition: "https://schema.org/NewCondition",
  brand: {
    "@type": 'Brand',
    name: 'E-Woman',
    logo: 'https://example.com/image.png',
  },
  offers: {
    price: x.get_price,
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    image: x.get_main_image,
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

<template>
  <section id="products-feed" class="my-10">
    <!-- Page Title -->
    <div id="feed-title" class="px-10">
      <TailCard class="shadow-none border-none p-1">
        <TailCardContent class="flex flex-row justify-start">
          <h1 class="uppercase font-bold text-2xl">
            {{ id }}
          </h1>
        </TailCardContent>
      </TailCard>
    </div>

    <!-- Feed -->
    <Suspense>
      <AsyncProductsFeed @products-loaded="handleLoadedProducts" @products-filter="showProductFilters=true" />

      <template #fallback>
        <ProductsLoadingFeed />
      </template>
    </Suspense>

    <ClientOnly>
      <ModalsProductFilters v-model="showProductFilters" :count="productCount" @update-products="handleUpdateProducts" />
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import type { Product, ProductsApiResponse } from '~/types'

const AsyncProductsFeed = defineAsyncComponent({
  loader: async () => import('~/components/products/Feed.vue')
})

const showProductFilters = ref<boolean>(false)
const productsLoading = ref<boolean>(true)
const products = ref<Product[]>([])

const { t } = useI18n()
const { id } = useRoute().params

provide('productsLoading', productsLoading)

const productCount = computed(() => {
  if (products.value) {
    return products.value.length
  } else {
    return 0
  }
})

/**
 * Callback function used to set the products loaded
 * in the async component feed back to here
 * 
 * @param data The product to use
 */
function handleLoadedProducts(data: Product[]) {
  productsLoading.value = false
  products.value = data
}

/**
 * Returns a list of products based on the filters
 * that were provided by the user
 * 
 * @param data The filtered products
 */
function handleUpdateProducts(data: ProductsApiResponse) {
  console.log(data)
}

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

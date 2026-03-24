<template>
  <section id="product" class="relative">
    <div class="grid grid-cols-12 grid-row-1 w-full gap-5">
      <!-- Images -->
      <client-only>
        <component :is="imagesComponent" :images="product?.node.productImages" :product="product" @zoom-image="(image: BaseImage) => selectImage(image)" />
      </client-only>
      
      <!-- Details -->
      <client-only>
        <product-page-aside-base :product="product" @size-guide="toggleSizeGuideDrawer()" @availability-modal="toggleAvailabilityModal()" @composition-guide="toggleCompositionModal()" />
      </client-only>
    </div>

    <!-- Recommendations -->
    <div id="recommendations" class="mt-10">
      <suspense>
        <template #default>
          <async-base-recommendation-block list-name="Recommendations Product Page" />
        </template>

        <template #fallback>
          <div class="grid grid-cols-4 gap-2">
            <products-loading-cards :quantity="8" />
          </div>
        </template>
      </suspense>
    </div>

    <client-only>
      <!-- Cart -->
      <product-page-bottom-cart v-if="product" :product="product" />

      <!-- Zoom -->
      <lazy-product-modals-image-zoom :product="product" hydrate-on-idle />
      
      <!-- Size Guide -->
      <lazy-product-modals-size-guide v-model:show="showSizeGuideDrawer" :product="product" hydrate-on-visible />
      
      <!-- Availability & Composition -->
      <lazy-product-modals-availability v-model:show="showAvailabilityModal" :product="product" hydrate-on-visible />
      
      <!-- Composition -->
      <lazy-product-modals-composition v-model:show="showCompositionModal" hydrate-on-visible />
    </client-only>
  </section>
</template>

<script setup lang="ts">
import { useBusinessDetails } from '~~/layers/base/app/data'
import type { BaseImage } from '~/types'

/**
 * Recommendations
 */

const AsyncBaseRecommendationBlock = defineAsyncComponent({
  loader: async () => import('~/components/base/Recommendations.vue'),
  suspensible: true,
  timeout: 5000
})

/**
 * Get Product
 */

const { product } = await useProductDetailsComposable()

/**
 * Analytics
 */

const { productEvent } = useGoogleAnalyticsCallbacks(product)
onMounted(async () => { await productEvent() })

/**
 * Image Zoom
 */

const { selectImage } = useImageZoomComposable()

/**
 * Stock
 */

// const { stockState } = useProductStockComposable(product, isLoading) 
// provide('stockState', stockState)

/**
 * Images Component
 */

const { imagesComponent } = useImageComponentComposable(product)

/**
 * Modals
 */

const [showSizeGuideDrawer, toggleSizeGuideDrawer] = useToggle<boolean>(false)
const [showAvailabilityModal, toggleAvailabilityModal] = useToggle<boolean>(false)
const [showCompositionModal, toggleCompositionModal] = useToggle<boolean>(false)

/**
 * SEO
 */

const route = useRoute()
const { get } = await useBusinessDetails()

const url = useRuntimeConfig().public.siteUrl

const name = product.value?.node.name || '...'
const description = `${name} - ${product.value?.node.color} - ${get('legalName')}€`

useSeoMeta({
  title: name,
  description,
  titleTemplate: `%s | ${get('legalName')}`
})

if (isDefined(product)) {
  useSeoMeta({
    ogDescription: description,
    ogImage: product.value.node.mainImage.original,
    twitterTitle: name,
    twitterDescription: description,
    twitterImage: product.value.node.mainImage.original,
    twitterCard: 'summary_large_image'
  })

  useSchemaOrg(
    defineProduct({
      "@type": 'Product',
      "@id": `${url}${route.fullPath}`,
      name,
      sku: product.value.node.sku,
      image: product.value.node.productImages?.map(image => image.original) ?? [],
      url: `${url}${route.fullPath}`,
      itemCondition: "https://schema.org/NewCondition",
      brand: {
        "@type": 'Brand',
        name: get('legalName'),
        logo: get('logo'),
      },
      offers: {
        price: product.value.node.price,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        image: product.value.node.mainImage.original,
        shippingDetails: {
          "@type": 'OfferShippingDetails',
          shippingDestination: [
            { "@type": "DefinedRegion", addressCountry: 'FR' },
            { "@type": "DefinedRegion", addressCountry: 'GP' }
          ],
          deliveryTime: null
        }
      }
    })
  )

  defineOgImage('Nuxt', {
    url: product.value.node.mainImage.original,
    width: 1200,
    height: 630,
    alt: name
  })
}
</script>

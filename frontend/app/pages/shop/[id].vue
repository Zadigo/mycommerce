<template>
  <section id="product" class="relative">
    <div class="grid grid-cols-12 grid-row-1 w-full gap-5">
      <!-- Images -->
      <client-only>
        <component :is="imagesComponent" :images="product?.node.productImages" :product="product" @zoom-image="selectImage" />
      </client-only>
      
      <!-- Details -->
      <client-only>
        <product-page-aside-base :product="product" @size-guide="showSizeGuideDrawer=true" @availability-modal="() => showAvailabilityModal=true" @composition-guide="() => showCompositionModal=true" />
      </client-only>
    </div>

    <!-- Recommendations -->
    <div id="recommendations" class="mt-10">
      <suspense>
        <template #default>
          <async-base-recommendation-block />
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
      <product-modals-image-zoom :product="product" />
      
      <!-- Size Guide -->
      <product-modals-size-guide v-model:show="showSizeGuideDrawer" :product="product" />
      
      <!-- Availability & Composition -->
      <product-modals-availability v-model:show="showAvailabilityModal" />
      
      <!-- Composition -->
      <product-modals-composition v-model:show="showCompositionModal" />
    </client-only>
  </section>
</template>

<script setup lang="ts">
/**
 * Recommendations
 */

const AsyncBaseRecommendationBlock = defineAsyncComponent({
  loader: async () => import('~/components/BaseRecommendations.vue'),
  suspensible: true,
  timeout: 5000
})

/**
 * Get Product
 */

const { product, isLoading } = await useProductDetailComposable()

/**
 * Image Zoom
 */

const { selectImage } = useImageZoomComposable()

/**
 * Stock
 */

const { stockState } = useProductStockComposable(product, isLoading) 
provide('stockState', stockState)

/**
 * Images Component
 */

const { imagesComponent } = useImageComponentComposable(product)

/**
 * Modals
 */

const showSizeGuideDrawer = ref<boolean>(false)
const showAvailabilityModal = ref<boolean>(false)
const showCompositionModal = ref<boolean>(false)

/**
 * SEO
 */

const name = product.value?.node.name || '...'

useSeoMeta({
  title: name,
  description: '',
  titleTemplate: '%s | E-Woman'
})

if (product.value) {
  useSchemaOrg(defineProduct({
    "@type": 'Product',
    "@id": `https://example.com/products/${product.value.node.slug}`,
    name,
    sku: product.value.node.sku,
    image: product.value.node.productImages?.map(image => image.original) ?? [],
    url: `https://example.com/products/${product.value.node.slug}`,
    itemCondition: "https://schema.org/NewCondition",
    brand: {
      "@type": 'Brand',
      name: 'E-Woman',
      logo: 'https://example.com/image.png',
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
  }))
}
</script>

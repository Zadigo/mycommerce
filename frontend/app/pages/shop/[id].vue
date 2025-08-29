<template>
  <section id="product" class="relative">
    <div class="grid grid-cols-12 grid-row-1 w-full gap-5">
      <!-- Images -->
      <ClientOnly>
        <component v-if="product" :is="imagesComponent" :images="product.images" :product="product" @zoom-image="handleSelectedImage" />
        <NoImages v-else :product="product" />
      </ClientOnly>
      
      <!-- Details -->
      <ClientOnly>
        <ProductPageAsideBase :product="product" @size-guide="showSizeGuideDrawer=true" @availability-modal="() => showAvailabilityModal=true" @composition-guide="() => showCompositionModal=true" />
      </ClientOnly>
    </div>

    <!-- Recommendations -->
    <div id="recommendations" class="mt-10">
      <Suspense>
        <template #default>
          <AsyncBaseRecommendationBlock />
        </template>

        <template #fallback>
          <div class="grid grid-cols-4 gap-2">
            <ProductsLoadingCards :quantity="8" />
          </div>
        </template>
      </Suspense>
    </div>

    <ClientOnly>
      <ProductPageBottomCart v-if="showBanner && product" :product="product" :show-banner="showBanner" />

      <ModalsImageZoom v-model="showModal" :product="product" :image="selectedImage" @select-image="handleSelectedImage" />
      <ModalsSizeGuide v-model="showSizeGuideDrawer" :product="product" />
      <ModalsAvailability v-model="showAvailabilityModal" />
      <ModalsComposition v-model="showCompositionModal" />
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
type ImageComponentMap = {[key: number]: Component}

const FiveImages = defineAsyncComponent(() => import('~/components/product/page/images/Five.vue'))
const SixImages = defineAsyncComponent(() => import('~/components/product/page/images/Six.vue'))
const NoImages = defineAsyncComponent(() => import('~/components/product/page/images/Empty.vue'))

const imageComponentMap: ImageComponentMap = {
  5: FiveImages,
  6: SixImages
}

const imagesComponent = computed((): Component => {  
  if (!product.value) {
    return NoImages
  } else if (product && product.value.images.length === 0) {
    return NoImages
  }else {
    const numberOfImages = product.value.images.length
    return imageComponentMap[numberOfImages] || NoImages
  }
})

const AsyncBaseRecommendationBlock = defineAsyncComponent({
  loader: async () => import('~/components/BaseRecommendations.vue'),
  suspensible: true,
  timeout: 5000
})

// const { customHandleError } = useErrorHandler()
const { showModal, selectedImage, handleSelectedImage, handleCloseSelection } = useImagesComposable()

const { product, isLoading, showBanner } = await useProductDetailComposable()
const { stockState } = useProductStockComposable(product, isLoading) 

provide('stockState', stockState)

console.log(product)

const showSizeGuideDrawer = ref<boolean>(false)
const showAvailabilityModal = ref<boolean>(false)
const showCompositionModal = ref<boolean>(false)

const name = product.value?.name ?? '...'

useSeoMeta({
  title: name,
  description: '',
  titleTemplate: '%s | E-Woman'
})

if (product.value) {
  useSchemaOrg(defineProduct({
    "@type": 'Product',
    "@id": `https://example.com/products/${product.value.slug}`,
    name,
    sku: product.value.sku,
    image: product.value.images?.map(image => image.original) ?? [],
    url: `https://example.com/products/${product.value.slug}`,
    itemCondition: "https://schema.org/NewCondition",
    brand: {
      "@type": 'Brand',
      name: 'E-Woman',
      logo: 'https://example.com/image.png',
    },
    offers: {
      price: product.value.get_price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      image: isDefined(product.value.get_main_image) ? product.value.get_main_image.original : null,
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

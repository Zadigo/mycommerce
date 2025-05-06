<template>
  <section id="product" class="relative">
    <div class="grid grid-cols-12 grid-row-1 w-full gap-5">
      <!-- Images -->
      <ClientOnly>
        <component v-if="product" :is="imagesComponent" :images="product.images" :product="product" @zoom-image="handleSelectedImage" />
        <NoImages v-else :product="product" />
      </ClientOnly>
      
      <ClientOnly>
        <!-- Details -->
        <ProductPageAsideBase :product="product" @show-size-guide="showSizeGuideDrawer=true" />
      </ClientOnly>
    </div>

    <!-- Recommendations -->
    <div id="recommendations" class="mt-10">
      <Suspense>
        <AsyncBaseRecommendationBlock />

        <template #fallback>
          <div class="grid grid-cols-4 gap-2">
            <ProductsLoadingCards :quantity="8" />
          </div>
        </template>
      </Suspense>
    </div>

    <ClientOnly>
      <ProductPageBottomCart v-if="showBanner && product" :y="y" :product="product" :show-banner="showBanner" />
      <ModalsImageZoom v-model="showModal" :product="product" :image="selectedImage" @select-image="handleSelectedImage" />
      <ModalsSizeGuide v-model="showSizeGuideDrawer" :product="product" />
      <ModalsAvailability v-model="showAvailabilityModal" :selected-size="'XS'" />
      <ModalsComposition v-model="showCompositionModal" />
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { ProductSchema } from '~/utils/schemas'

import type { ExtendedRouteParamsRawGeneric, Product, ProductStockApiResponse } from '~/types'

type ImageComponentMap = {[key: number]: Component}

const FiveImages = defineAsyncComponent(() => import('~/components/product/page/images/Five.vue'))
const SixImages = defineAsyncComponent(() => import('~/components/product/page/images/Six.vue'))
const NoImages = defineAsyncComponent(() => import('~/components/product/page/images/Empty.vue'))

const imageComponentMap: ImageComponentMap = {
  5: FiveImages,
  6: SixImages
}

const AsyncBaseRecommendationBlock = defineAsyncComponent({
  loader: async () => import('~/components/BaseRecommendations.vue'),
  suspensible: true,
  timeout: 5000
})

const shopStore = useShop()

const { handleError } = useErrorHandler()
const { showModal, selectedImage, handleSelectedImage, handleCloseSelection } = useImages()

const { $client } = useNuxtApp()
const { y } = useScroll(window)
const { id } = useRoute().params as ExtendedRouteParamsRawGeneric

/**
 * TODO: Documentation
 */
const { data: product, status } = useFetch<Product>(`/api/products/${id}`, {
  method: 'GET',
  transform(data) {
    try {
      const validItem = ProductSchema.parse(data)
    } catch (e) {
      console.log('Could not validate prouct', e)
    }

    return data
  },
  onResponseError({ error }) {
    createError({
      statusMessage: error?.message,
      statusCode: 404
    })
  }
})

const stockState = ref<ProductStockApiResponse>()
const showSizeGuideDrawer = ref<boolean>(false)
const showAvailabilityModal = ref<boolean>(false)
const showCompositionModal = ref<boolean>(false)

const isLoading = computed(() => status.value === 'pending')
const showBanner = computed(() => y.value >= 1200 && y.value <= 7000)

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

/**
 * Get the state for the current stock
 * of the product
 */
async function requestProductStock () {
  try {
    if (product.value) {
      const response = await $client<ProductStockApiResponse>(`/api/v1/stocks/products/${product.value.id}`, {
        method: 'GET'
      })
      stockState.value = response
    }
  } catch (e) {
    handleError(e)
  }
}

useHead({
  title: () => product.value?.name ?? '...',
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})

// useSchemaOrg([
//   defineProduct({
//     '@id': product.value?.name,
//     name: product.value?.name,
//     description: '',
//     image: product.value?.get_main_image?.original,
//     offers: [
//       {
//         price: product.value?.sale_price
//       }
//     ]
//   })
// ])

provide('stockState', stockState)

onMounted(async () => {
  if (!isLoading) {
    await delay(1000)
    await requestProductStock()
    
    nextTick(() => {
      shopStore.trackProduct(product.value)

      // TODO: G-Analytics
      // gtag('event', 'view_item', {
      //   items: [
      //     {
      //       item_id: product.value.id,
      //       item_name: product.value.name,
      //       price: product.value.get_price,
      //       item_brand: null,
      //       item_category: product.value.category,
      //       index: shopStore.currentProductIndex
      //     }
      //   ]
      // })
    })
  }
})
</script>

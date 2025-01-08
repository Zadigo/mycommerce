<template>
  <section id="product" class="container-fluid px-0 mb-5" style="margin-top: 59px;">
    <!-- Two blocks images -->
    <div class="row gy-1 gx-3">
      <div class="col-8">
        <div class="row gy-2 gx-2">
          <ProductDetailsTwoImages :product="product" :indexes="[0, 1]" @select-image="handleSelectedImage" />
          <ProductDetailsTwoImages :product="product" :indexes="[2, 3]" @select-image="handleSelectedImage" />
          <ProductDetailsTwoImages :product="product" :indexes="[4, 5]" @select-image="handleSelectedImage" />
        </div>
      </div>

      <ProductDetailsAside :product="product" :is-loading="isLoading" class="col-4 mt-5" sticky @show-size-guide="showSizeGuideDrawer=true" />
    </div>

    <!-- Multi-Block Image -->
    <div class="row gy-1 d-none">
      <div id="product-multi-grid" class="col-12">
        <div class="row">
          <!-- Main Image -->
          <ProductDetailsSingleMainImage :product="product" />

          <!-- Aside -->
          <ProductDetailsAside :product="product" :is-loading="isLoading" class="col-4 mt-4" />
        </div>
      </div>

      <!-- More Product Images -->
      <component :is="imageComponent" :images="product?.images" />
    </div>

    <!-- More Products -->
    <div ref="moreProductsIntersect" class="row g-1 my-5">
      <div id="more-products" class="col-12">
        <Suspense>
          <template #default>
            <AsyncBaseRecommendationBlock :columns="2" :quantity="30" />
          </template>

          <template #fallback>
            <BaseLoadingRecommendations :quantity="30" />
          </template>
        </Suspense>
      </div>
    </div>

    <ClientOnly>
      <!-- Modals -->
      <ModalsImageZoom :show="showModal" :product="product" :image="selectedImage" @select-image="handleSelectedImage" @close="handleCloseSelection" />
      <ModalsSizeGuide :product="product" :show-modal="showSizeGuideDrawer" @close="showSizeGuideDrawer=false" />
    </ClientOnly>
  </section>
</template>

<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core'
import type { ConcreteComponent } from 'vue'
import type { Product, ProductStock } from '~/types'

const ProductDetailsFiveImages = resolveComponent('ProductDetailsFiveImages')
const ProductDetailsSixImages = resolveComponent('ProductDetailsSixImages')

const AsyncBaseRecommendationBlock = defineAsyncComponent({
  loader: async () => import('~/components/BaseRecommendations.vue'),
  timeout: 5000
})

const { $client } = useNuxtApp()

// Composable for product fetching
function useProductDetails () {
  const route = useRoute()
  const { ValidateProp } = useShopComposable()

  /**
   * WRITE DOCUMENTATION
   */
  const { data, status } = useFetch<Product>(`/api/products/${route.params.id}`, {
    method: 'GET'
  })
  const product = computed(() => data.value)
  const isLoading = computed(() => status.value !== 'success' && ValidateProp(product.value))

  provide('isLoading', isLoading)

  return {
    isLoading,
    product
  }
}

// Composable for stock management
function useProductSotck (product: Ref<Product | null>) {
  const stockState = ref<ProductStock>()
  const { handleError } = useErrorHandler()

  async function requestProductStock () {
    try {
      if (product.value) {
        const response = await $client.get<ProductStock>(`stocks/products/${product.value.id}`)
        stockState.value = response.data
      }
    } catch (e) {
      handleError(e)
    }
  }

  provide('stockState', stockState)

  return {
    stockState,
    requestProductStock
  }
}

// Composable for tracking visited products
function useVisitedProducts (product: Ref<Product | null>) {
  const visitedProducts = useLocalStorage<number[]>('visited', null, {
    deep: true,
    serializer: {
      read: (raw) => JSON.parse(raw),
      write: (value) => JSON.stringify(value)
    }
  })
  
  function trackProduct () {
    if (product.value) {
      if (visitedProducts.value) {
        visitedProducts.value.push(product.value.id)
      } else {
        visitedProducts.value = [product.value.id]
      }
    }
  }

  return {
    trackProduct
  }
}

// TODO: Refactor into a composable
const moreProductsIntersect = ref<HTMLElement>()

const { product, isLoading } = useProductDetails()
const { trackProduct } = useVisitedProducts(product)
const { requestProductStock } = useProductSotck(product)
const { showModal, selectedImage, handleSelectedImage, handleCloseSelection } = useImages()
const { gtag } = useGtag()

const shopStore = useShop()
const showSizeGuideDrawer = ref(false)

/**
 * Returns the proper image component to display
 * the remaining images for the given product
 */
const imageComponent = computed((): ConcreteComponent | string => {
  const imageCount = product.value?.images?.length ?? 0
  return imageCount === 6 
  ? ProductDetailsSixImages
  : ProductDetailsFiveImages
})

useHead({
  title: () => product.value?.name ?? 'Product Details',
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})

onBeforeMount(() => {
  nextTick(trackProduct)
})

onMounted(async () => {
  await requestProductStock()

  if (product.value) {
    gtag('event', 'view_item', {
      items: [
        {
          item_id: product.value.id,
          item_name: product.value.name,
          price: product.value.get_price,
          item_brand: null,
          item_category: product.value.category,
          index: shopStore.currentProductIndex
        }
      ]
    })

    // $fbq('dataProcessingOptions', 'ViewContent', {
    //   content_ids: product.value.id,
    //   content_name: product.value.name,
    //   content_type: 'product',
    //   value: product.value.get_price
    // })
  }
})
</script>

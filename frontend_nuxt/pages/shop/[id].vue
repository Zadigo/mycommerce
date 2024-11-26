<template>
  <section id="product" class="container-fluid px-0" style="margin-top: 1%;margin-bottom: 2%;">
    <!-- Product -->
    <div class="row gy-1">
      <div id="product-information" class="col-12">
        <div class="row">
          <!-- Main Image -->
          <ProductDetailsSingleMainImage :product="product" />

          <!-- Aside -->
          <ProductDetailsAside :product="product" :is-loading="isLoading" />
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
            <AsyncBaseRecommendationBlock :columns="3" :quantity="30" />
          </template>

          <template #fallback>
            <BaseLoadingRecommendations :quantity="30" />
          </template>
        </Suspense>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core';
import type { ConcreteComponent } from 'vue';
import type { Product } from '~/types';

const ProductDetailsFiveImages = resolveComponent('ProductDetailsFiveImages')
const ProductDetailsSixImages = resolveComponent('ProductDetailsSixImages')

const route = useRoute()
const visitedProducts = useLocalStorage<number[]>('visited', null, {
  deep: true,
  serializer: {
    read (raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    },
  }
})

const { data, status } = await useFetch<Product>(`/api/products/${route.params.id}`, {
  method: 'GET'
})

const AsyncBaseRecommendationBlock = defineAsyncComponent({
  loader: async () => import('@/components/BaseRecommendations.vue')
})

const product = ref<Product | null>(data.value)
const moreProductsIntersect = ref<HTMLElement>()

useHead({
  title: () => {
    if (product.value) {
      return product.value.name
    } else {
      return null
    }
  },
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})

const isLoading = computed(() => {
  return status.value !== 'success' || product.value === null
})

/**
 * Returns the proper image component to display
 * the remaining images for the given product
 */
const imageComponent = computed((): string | ConcreteComponent => {
  if (product.value) {
    if ('images' in product.value) {
      if (product.value.images.length === 6) {
        return ProductDetailsSixImages
      } else if (product.value.images.length === 5) {
        return ProductDetailsFiveImages
      }
    }
  }
  return ProductDetailsFiveImages
})

onBeforeMount(() => {
  setTimeout(() => {
    if (product.value) {
      if (visitedProducts.value) {
        visitedProducts.value.push(product.value.id)
      } else {
        visitedProducts.value = [product.value.id]
      }
    }
  }, 1000)
})
</script>

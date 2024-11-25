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
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { Product } from '~/types';

const route = useRoute()

const { data, status } = await useFetch<Product>(`/api/products/${route.params.id}`, {
  method: 'GET'
})

const product = ref<Product | null>(data.value)

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
</script>

<template>
  <base-skeleton :loading="isLoading" width="80%">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link :to="{ name: 'shop_collections' }" class="link-dark">
          {{ $t('Boutique') }}
        </router-link>
      </li>

      <li class="breadcrumb-item">
        <router-link :to="{ name: 'shop_products_collection', params: { id: currentProduct?.category.toLowerCase() } }" class="link-dark">
          {{ currentProduct?.category }}
        </router-link>
      </li>

      <li class="breadcrumb-item active" aria-current="page">
        {{ currentProduct?.name }}
      </li>
    </ol>
  </base-skeleton>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

import { Product } from '@/types/shop';

import BaseSkeleton from '@/layouts/BaseSkeleton.vue';

export default defineComponent({
  name: 'BreadcrumbBlock',
  components: {
    BaseSkeleton
  },
  setup () {
    const currentProduct = inject<Product>('currentProduct')
    const isLoading = inject<boolean>('isLoading')
    
    return {
      isLoading,
      currentProduct
    }
  }
})
</script>

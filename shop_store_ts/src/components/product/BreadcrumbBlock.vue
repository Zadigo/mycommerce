<template>
  <v-skeleton-loader :loading="isLoading" type="text">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link :to="{ name: 'shop_collections' }" class="link-dark">
          {{ $t('Boutique') }}
        </router-link>
      </li>

      <li class="breadcrumb-item">
        <router-link :to="{ name: 'shop_products_collection', params: { id: currentProduct.category?.toLowerCase() } }" class="link-dark">
          {{ currentProduct.category }}
        </router-link>
      </li>

      <li class="breadcrumb-item active" aria-current="page">
        {{ currentProduct.name }}
      </li>
    </ol>
  </v-skeleton-loader>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

export default defineComponent({
  name: 'BreadcrumbBlock',
  setup () {
    const currentProduct = inject('currentProduct')
    const isLoading = inject('isLoading')
    return {
      isLoading,
      currentProduct
    }
  }
})
</script>

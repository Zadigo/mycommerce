<template>
  <div id="product-info">
    <h1 v-if="product" id="product-name" class="text-md mt-15 font-bold">
      {{ product.node.name }}
    </h1>

    <volt-skeleton v-else height="20px" />
    
    <template v-if="product">
      <div v-if="product.node.onSale" class="font-bold text-md inline-flex gap-2 mt-1">
        <span class="text-red-400">{{ $n(parseInt(product.node.price.toString()), 'currency') }}</span>
        <span class="text-black"><s>{{ $n(parseInt(product.node.unitPrice.toString()), 'currency') }}</s></span>
      </div>

      <p v-else class="font-bold text-xl mt-1">
        {{ $n(parseInt(product.node.price.toString()), 'currency') }}
      </p>
    </template>

    <volt-skeleton v-else height="20px" />
  </div>
</template>

<script setup lang="ts">
import type { ProductNode } from '~/types'

defineProps<{ product: ProductNode }>()
</script>

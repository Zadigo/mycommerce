<template>
  <div>
    <h1 v-if="product" id="product-name" :aria-label="product.color_variant_name" class="text-lg mt-5 font-normal">
      {{ product.name }}
    </h1>

    <tail-skeleton v-else height="20px" />
    
    <template v-if="product">
      <div v-if="product.on_sale" class="font-bold text-lg inline-flex gap-2 mt-1">
        <span class="text-red-400">{{ $n(parseInt(product.get_price), 'currency') }}</span>
        <span class="text-black"><s>{{ $n(parseInt(product.unit_price), 'currency') }}</s></span>
      </div>

      <p v-else class="font-bold text-xl mt-1">
        {{ $n(parseInt(product.get_price), 'currency') }}
      </p>
    </template>

    <tail-skeleton v-else height="20px" />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

defineProps<{ product: Product | null | undefined }>()
</script>

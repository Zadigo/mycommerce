<template>
  <div class="grid grid-cols-3 gap-1">
    <products-feed-image v-for="product in products" :key="product.id" :image-src="product.get_main_image?.original" @click="emit('navigate', product)" />
  </div>
</template>

<script lang="ts" setup>
import type { Product } from '~/types'

const { products = []} = defineProps<{ products?: Product[] }>()
const emit = defineEmits<{ navigate: [product: Product] }>()
</script>

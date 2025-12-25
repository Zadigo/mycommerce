<template>
  <!-- NOTE: Keep opacity low for testing purposes -->
  <div :class="{ 'translate-y-0 opacity-10': !showBanner, 'translate-y-0 opacity-100': showBanner }" class="bg-white p-2 rounded-md shadow-md fixed bottom-5 w-7/12 mx-auto left-1/4 h-auto transition-all ease z-50">
    <div v-if="product" class="flex justify-between">
      <div class="flex justify-start gap-3 items-center self-center">
        <nuxt-img :src="product.node.mainImage.original" :alt="product.node.mainImage.variant" class="w-10 rounded-md" />

        <div class="flex flex-col">
          <p class="font-normal text-sm">
            {{ product.node.name }}
          </p>

          <p class="font-bold">
            {{ $n(parseFloat(product.node.price.toString()), 'currency') }}
          </p>
        </div>
      </div>

      <div class="flex justify-around align-center gap-2">
        <volt-select v-model="selectedSize" :options="product.node.sizeSet" option-label="name" />

        <volt-button @click="() => { createItem(product, selectedSize); }" size="lg">
          {{ $t('Ajouter au panier') }}
        </volt-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductNode } from '~/types'

const { product } = defineProps<{ product: ProductNode, showBanner?: boolean }>()
const emit = defineEmits<{ 'size-selected': [value: string] }>()

/**
 * Size Selection
 */
const { selectedSize } = useSizeSelection(product)

/**
 * Cart
 */

const { createItem } = useCartComposable()
 
/**
  * Show Banner on Scroll
  */

const showBanner = ref<boolean>(false)

if (import.meta.client) {
  const { y } = useScroll(window)

  watch(y, (newY) => {
    showBanner.value = newY >= 1200 && newY <= 7000
  })
}
</script>

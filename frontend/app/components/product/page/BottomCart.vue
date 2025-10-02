<template>
  <div :class="{ 'translate-y-0 opacity-10': !showBanner, 'translate-y-0 opacity-100': showBanner }" class="bg-white p-2 rounded-md shadow-md fixed bottom-5 w-7/12 mx-auto left-1/4 h-auto transition-all ease z-50">
    <div v-if="product" class="flex justify-between">
      <div class="flex justify-start gap-3 items-center self-center">
        <NuxtImg v-if="product.get_main_image" :src="product.get_main_image.original" :alt="product.color_variant_name" class="w-10 rounded-md" />
        <volt-skeleton v-else height="50px" width="50px" />
        
        <div class="flex flex-col">
          <p class="font-normal text-sm">
            {{ product.name }}
          </p>

          <p class="font-bold">
            {{ $n(parseFloat(product.unit_price), 'currency') }}
          </p>
        </div>
      </div>

      <div class="flex justify-around align-center gap-2">
        <volt-select v-model="userSelection.size" :options="product.sizes" option-label="name" option-name="name" />
        <volt-button @click="() => { cartStore.addToCart(product) }">
          {{ $t('Ajouter au panier') }}
        </volt-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

const cartStore = useCart()
const { userSelection } = storeToRefs(cartStore)

const { product, showBanner = false } = defineProps<{ product: Product, showBanner?: boolean }>()
const emit = defineEmits<{ 'size-selected': [value: string] }>()
</script>

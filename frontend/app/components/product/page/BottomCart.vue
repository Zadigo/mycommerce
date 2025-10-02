<template>
  <div :class="{ 'translate-y-0 opacity-10': !showBanner, 'translate-y-0 opacity-100': showBanner }" class="bg-white p-2 rounded-md shadow-md fixed bottom-5 w-7/12 mx-auto left-1/4 h-auto transition-all ease z-50">
    <div v-if="product" class="flex justify-between">
      <div class="flex justify-start gap-3 items-center self-center">
        <NuxtImg v-if="product.get_main_image" :src="product.get_main_image.original" :alt="product.color_variant_name" class="w-10 rounded-md" />
        <tail-skeleton v-else class="h-[50px] w-[50px]" />
        
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
        <TailSelect v-model="selectedSize" class="w-[200px]">
          <TailSelectTrigger>
            <TailSelectValue>
              {{ userSelection.size }}
            </TailSelectValue>
          </TailSelectTrigger>

          <TailSelectContent>
            <TailSelectGroup>
              <TailSelectLabel>Sizes</TailSelectLabel>
              <TailSelectItem v-for="sizeName in sizeNames" :key="sizeName" :value="sizeName">
                {{ sizeName }}
              </TailSelectItem>
            </TailSelectGroup>
          </TailSelectContent>
        </TailSelect>

        <volt-button @click="() => { cartStore.addToCart(product) }">
          {{ $t('Ajouter au panier') }}
        </volt-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { doc, updateDoc, getDoc } from 'firebase/firestore'
import type { Product } from '~/types'

// const { $fireStore } = useNuxtApp()

const cartStore = useCart()
const { userSelection, showSizeSelectionWarning } = storeToRefs(cartStore)

const { product, showBanner = false } = defineProps<{ product: Product, showBanner?: boolean }>()
const emit = defineEmits<{ 'size-selected': [value: string] }>()

const sizeNames = computed(() => {
  if (product) {
    return product.sizes.map(x => x.name)
  } else {
    return []
  }
})

const selectedSize = computed({
  get: () => cartStore.userSelection.size,
  set: (value: string) => {
    cartStore.sizeSelection(product, value)
  }
})
</script>

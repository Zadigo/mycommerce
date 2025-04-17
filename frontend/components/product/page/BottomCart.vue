<template>
  <div :class="{ 'translate-y-0 opacity-10': !showBanner, 'translate-y-0 opacity-100': showBanner }" class="bg-white pa-2 rounded-md shadow-md fixed bottom-5 w-7/12 mx-auto left-1/4 h-auto transition-all ease z-50">
    <div v-if="product" class="flex justify-between">
      <div class="flex justify-start gap-3 items-center self-center">
        <img :src="product.get_main_image.original" :alt="product.color_variant_name" class="w-10 rounded-md">
        
        <div class="flex flex-col">
          <p class="font-normal text-sm">
            {{ product.name }}
          </p>

          <p class="font-bold">
            {{ translatePrice(product.unit_price) }}
          </p>
        </div>
      </div>

      <div class="flex justify-around align-center gap-2">
        <DevOnly>
          <span>
            {{ y }}
          </span>
        </DevOnly>

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

        <TailButton @click="handleProxyAddToCart">
          {{ $t('Ajouter au panier') }}
        </TailButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cartStore = useCart()
const { userSelection, showSizeSelectionWarning } = storeToRefs(cartStore)

const { translatePrice } = useShopComposable()
import type { Product } from '~/types'

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true
  },
  showBanner: {
    type: Boolean,
    default: false
  },
  y: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits({
  'size-selected'(_value: string) {
    return true
  }
})

const sizeNames = computed(() => {
  if (props.product) {
    return props.product.sizes.map(x => x.name)
  } else {
    return []
  }
})

const selectedSize = computed({
  get: () => cartStore.userSelection.size,
  set: (value: string) => {
    cartStore.handleSizeSelection(props.product, value)
  }
})

function handleProxyAddToCart() {
  cartStore.addToCart(props.product, null, (data) => {
    console.log(data)
  })
}
</script>

<template>
  <div v-show="showCart && isHovered" class="absolute w-full flex justify-center align-middle transition-all ease-in-out z-30 invisible lg:visible lg:bottom-[3.5rem]">
    <div class="bg-white rounded-md py-5 px-2 w-5/6">
      <p class="font-light text-sm text-center mb-3">
        {{ $t("Sélectionne la taille") }}
      </p>

      <div v-if="requiresSizeItems" class="flex justify-center flex-wrap gap-2">
        <button v-for="size in product.sizes" :key="size.id" :aria-label="size.name" type="button" class="py-1 px-1 text-sm flex gap-1 place-items-center underline-offset-4 transition-all duration-200 hover:underline hover:font-semibold" @click="handleAddToCart(size.name)">
          <Icon v-if="!size.availability" name="fa-regular:clock" size="11" class="text-orange-400" />
          <span>{{ size.name }}</span>
        </button>
      </div>

      <TailButton v-else variant="default" @click="handleAddToCart('Unique')">
        {{ $t('Ajouter au panier') }}
      </TailButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Product } from '~/types'

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true
  },
  isHovered: {
    type: Boolean,
    default: false
  },
  showCart: {
    type: Boolean,
    default: true
  }
})

const cartStore = useCart()

const { showAddedProductDrawer } = storeToRefs(cartStore)

/**
 *
 */
const requiresSizeItems = computed(() => {
  if (props.product) {
    return props.product.sizes.length > 0
  } else {
    return false
  }
})

/**
 * Adds a new product in the cart
 * 
 * @param size The size to associate the product in the cart with
 */
async function handleAddToCart (size?: string | number) {
  if (props.product) {
    await cartStore.addToCart(props.product,  size, (data) => {
      showAddedProductDrawer.value = true

      if (cartStore.sessionCache) {
        cartStore.sessionCache.cart = data
      }
    })
  } else {
    console.error('Card', 'Props does not have a product')
  }
}
</script>>

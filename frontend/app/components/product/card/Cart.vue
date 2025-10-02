<template>
  <div v-show="showCart && isHovered" class="absolute w-full flex justify-center align-middle transition-all ease-in-out z-30 invisible md:bottom-2/20 lg:visible lg:bottom-2/20">
    <div class="bg-white rounded-md py-5 px-2 w-5/6">
      <p class="font-light text-sm text-center mb-3">
        {{ $t("Sélectionne la taille") }}
      </p>

      <!-- Sizes -->
      <div v-if="requiresSizeSelection" class="flex justify-center flex-wrap gap-2">
        <button v-for="size in product.sizes" :key="size.id" :aria-label="size.name" type="button" class="py-1 px-1 text-sm flex gap-1 place-items-center underline-offset-4 cursor-pointer hover:underline hover:font-semibold" @click="() => cartStore.sizeSelection(product, size, true)">
          <Icon v-if="!size.availability" name="i-fa7-regular:clock" size="11" class="text-orange-400" />
          <span>{{ size.name }}</span>
        </button>
      </div>

      <!-- Add To Cart -->
      <tail-button v-else variant="default" @click="() => uniqueAddToCart()">
        {{ $t('Ajouter au panier') }}
      </tail-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

const props = defineProps<{
  product: Product
  isHovered?: boolean
  showCart?: boolean
}>()

const cartStore = useCart()
const { showAddedProductDrawer } = storeToRefs(cartStore)

const { hasSizes: requiresSizeSelection } = useProductComposable(props.product)

/**
 * Proxy function that adds the product to the cart
 * when the size is "Unique"
 */
async function uniqueAddToCart () {
  if (props.product) {
    await cartStore.addToCart(props.product, (data) => {
      showAddedProductDrawer.value = true
      cartStore.cache = data
    })
  } else {
    console.error('Card', 'Props does not have a product')
  }
}
</script>

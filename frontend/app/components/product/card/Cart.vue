<template>  
  <div class="bg-transparent absolute bottom-4/20 md:bottom-3/20 lg:bottom-2/20 left-0 p-5 w-full flex justify-center gap-2">
    <volt-contrast-button v-for="size in product.node.sizeSet" :key="size.name" size="small" class="min-w-2">
      {{ size.name }}
    </volt-contrast-button>
  </div>
</template>

<script setup lang="ts">
import type { ProductNode } from '~/types'

const props = defineProps<{
  product: ProductNode
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
    await cartStore.addToCart(props.product, () => {
      showAddedProductDrawer.value = true
    })
  } else {
    console.error('Card', 'Props does not have a product')
  }
}
</script>

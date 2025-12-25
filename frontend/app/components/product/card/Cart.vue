<template>  
  <div class="bg-transparent absolute bottom-4/20 md:bottom-3/20 lg:bottom-2/20 left-0 p-5 w-full flex justify-center gap-2 z-30">
    <volt-contrast-button v-for="size in product.node.sizeSet" :key="size.name" size="small" class="min-w-2" @click="() => createItem(product, size, async () => { await successCallback(size) })">
      {{ size.name }}
    </volt-contrast-button>
  </div>
</template>

<script setup lang="ts">
import type { BaseSizeSet, ProductNode } from '~/types'

const props = defineProps<{
  product: ProductNode
  isHovered?: boolean
  showCart?: boolean
}>()

/**
 * Analytics
 */

const { addToCartEvent } = useGoogleAnalyticsCallbacks(props.product)

/**
 * Cart
 */

const { createItem } = useCartComposable()

// TODO: Create a special global state modal for a AddedProduct which
// gets triggered whene a user adds a product, will closed automatically
// after a few seconds, can also be closed manually (when the user user
// clicks outside the modal or on a close button) and where the close can
// be prevented when the user hovers over the modal

const showAddedProductDrawer = useState<boolean>('showAddedProductDrawer')

const { start } = useCountdown(3, {
  onComplete() {
    showAddedProductDrawer.value = false
  }
})

const successCallback = async (size: BaseSizeSet) => {
  showAddedProductDrawer.value = true
  start()
  await addToCartEvent(undefined, size.name)
}
</script>

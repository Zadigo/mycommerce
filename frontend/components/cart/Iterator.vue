<template>
  <div class="my-1">
    <article v-for="item in cartItems" :key="item.product__id" :aria-label="item.product__name" class="border-2 border-gray-50 rounded-md pa-3 mb-2">
      <div class="flex justify-start gap-3">
        <div id="image" class="w-2/4">
          <NuxtLinkLocale  id="link-product-img" :to="`/shop/${item.product__id}`" @click="$emit('show-cart-drawer')">
            <NuxtImg :src="mediaPath(item.product_info?.product.get_main_image.original, '/placeholder.svg')" class="w-full rounded-md" />
          </NuxtLinkLocale >
        </div>

        <div id="infos">
          <NuxtLinkLocale  id="link-product-body" :to="`/shop/${item.product__id}`" @click="$emit('show-cart-drawer')">
            <p class="mb-1 font-light text-sm">
              {{ item.product__name }}
            </p>

            <div class="font-bold">
              <!-- {{ $n(parseFloat(item.product_info?.price), 'currency') }} -->
            </div>
            
            <div class="font-light mb-1 flex justify-start align-center gap-1">
              <span v-if="item.product_info">
                {{ item.product_info.size }}
              </span>

              <span>
                {{ item.quantity }}x
              </span>
            </div>
          </NuxtLinkLocale >

          <div id="actions">
            <TailButton v-if="isEditable" id="action-edit-product" class="me-2" size="sm rounded-full" @click="handleProductEdition(item)">
              <Icon name="fa-solid:pen" />
            </TailButton>

            <TailButton id="action-delete-product" size="sm rounded-full" @click="proxyDeleteFromCart(item)">
              <Icon name="fa-solid:trash" />
            </TailButton>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { ProductToEdit } from '~/types'

defineProps({
  isEditable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits({
  'edit-product' (_editedProduct: ProductToEdit) {
    return true
  },
  'show-cart-drawer' () {
    return true
  }
})


// const { gtag } = useGtag()
const cartStore = useCart()
const { mediaPath } = useDjangoUtilies()

const { sessionCache } = storeToRefs(cartStore)

/**
 * Computed property that get the items from the session
 * and iterates on each statistic object to be displayed
 */
const cartItems = computed((): ProductToEdit[] => {
  if (sessionCache.value) {
    if (sessionCache.value.cart) {
      return sessionCache.value.cart.statistics.map((item) => {
        const productInfo = sessionCache.value.cart.results.find((cartItem) => {
          return cartItem.product.id === item.product__id
        })
        return { ...item, product_info: productInfo }
      })
    }
  }
  return []
})

/**
 * Function to open the product edition drawer
 * 
 * @param item The item to edit
 */
function handleProductEdition (item: ProductToEdit) {
  emit('edit-product', item)
}

/**
 * TODO: Callback function used to construct a valid GA-4
 * object to be sent to Analytics
 * 
 * @param deletedItem The deleted product
 * @param updatedCart The updated cart object
 */
// function callbackRemoveFromCart(deletedItem: ProductToEdit, updatedCart: CartUpdateApiResponse) {
//   const items = [
//     {
//       item_id: deletedItem.product__id,
//       item_name: deletedItem.product__name,
//       item_category: null,
//       item_category2: null,
//       price: deletedItem.total,
//       quantity: deletedItem.quantity
//     }
//   ]

//   TODO: G-Analytics
//   gtag('event', 'remove_from_cart', {
//     currency: 'EUR',
//     value: updatedCart.total,
//     items
//   })

//   useTrackEvent('remove_from_cart', {
//     currency: 'EUR',
//     checkout_step: 1,
//     items
//   })
// }

/**
 * @param cartItem The item t odelete from the cart
 */
function proxyDeleteFromCart(cartItem: ProductToEdit) {
  cartStore.deleteFromCart(cartItem, () => {

  })
}
</script>

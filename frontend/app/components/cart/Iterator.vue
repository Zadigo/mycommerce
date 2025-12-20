<template>
  <div v-if="cart" class="my-1">
    <article v-for="cartItem in cart" :key="cartItem.product.id" class="border-2 border-gray-50 rounded-md p-3 mb-2">
      <div class="flex justify-start gap-3">
        <div id="image" class="w-2/4">
          <nuxt-link-locale  id="link-product-img" :to="`/shop/${cartItem.product.id}`" @click="$emit('show-cart-drawer')">
            <nuxt-img :src="cartItem.product.mainImage.original" class="w-full rounded-md" />
          </nuxt-link-locale >
        </div>

        <div id="infos">
          <nuxt-link-locale  id="link-product-body" :to="`/shop/${cartItem.product.id}`" @click="$emit('show-cart-drawer')">
            <p class="mb-1 font-light text-sm">
              {{ cartItem.product.name }}
            </p>

            <div class="font-bold">
              {{ $n(cartItem.product.price.toString(), 'currency') }}
            </div>
            
            <div class="font-light mb-1 flex justify-start align-center gap-1">
              <span>{{ cartItem.size }}</span>
              <span>{{ cartItem.quantity }}x</span>
            </div>
          </nuxt-link-locale >

          <div id="actions" class="mt-5">
            <volt-button v-if="isEditable" id="action-edit-product" variant="light" class="me-2 rounded-full" size="sm" @click="handleProductEdition(cartItem)">
              <icon name="i-lucide:pen" />
            </volt-button>

            <volt-button id="action-delete-product" variant="light" class="rounded-full" size="sm" @click="async () => await removeProduct(cartItem)">
              <icon name="i-lucide:trash" />
            </volt-button>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from '~/types'

const props = defineProps<{ isEditable?: boolean }>()
const emit = defineEmits<{ 'edit-product': [editedProduct: CartItem], 'show-cart-drawer': [] }>()

// const { gtag } = useGtag()

const { cart, reduceQuantity, removeProduct } = useCartComposable()

console.log('iterator.statistics', cart?.value)

/**
 * Computed property that get the items from the session
 * and iterates on each statistic object to be displayed
 */
// const cartItems = computed((): ProductToEdit[] => {
//   if (sessionCache.value) {
//     if (sessionCache.value.cart) {
//       return sessionCache.value.cart.statistics.map((item) => {
//         const productInfo = sessionCache.value.cart.results.find((cartItem) => {
//           return cartItem.product.id === item.product__id
//         })
//         return { ...item, product_info: productInfo }
//       })
//     }
//   }
//   return []
// })

/**
 * Function to open the product edition drawer
 * 
 * @param item The item to edit
 */
function handleProductEdition (item: CartItem) {
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
// function proxyDeleteFromCart(cartItem: ProductToEdit) {
//   cartStore.deleteFromCart(cartItem)
// }
</script>

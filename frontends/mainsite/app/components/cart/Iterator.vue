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
              {{ $n(cartItem.product.price, 'currency') }}
            </div>
            
            <div class="font-light mb-1 flex justify-start align-center gap-1">
              <span>{{ cartItem.size.name }}</span>
              <span>{{ cartItem.quantity }}x</span>
            </div>
          </nuxt-link-locale >

          <div id="actions" class="mt-5">
            <volt-button v-if="isEditable" id="action-edit-product" variant="light" class="me-2 rounded-full" size="sm" @click="proxyCloseAllModals(cartItem)">
              <icon name="i-lucide:pen" />
            </volt-button>

            <volt-button id="action-delete-product" variant="light" class="rounded-full" size="sm" @click="async () => { await removeProduct(cartItem) }">
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

/**
 * Cart
 */

const { cart, removeProduct } = useCartComposable()

/**
 * Modals
 */

const { editedCartItem } = await useEditCartItemComposable()
const { closeAllModals } = useModalsState()

function proxyCloseAllModals(cartItem: CartItem) {
  closeAllModals(({ editProduct }) => {
    editedCartItem.value = cartItem
    editProduct.value = true
  })
}

// const { gtag } = useGtag()

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

</script>

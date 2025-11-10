<template>
  <div class="my-1">
    <article v-for="item in statistics" :key="item.product__id" class="border-2 border-gray-50 rounded-md p-3 mb-2">
      <div class="flex justify-start gap-3">
        <div id="image" class="w-2/4">
          <nuxt-link-locale  id="link-product-img" :to="`/shop/${associatedValue(item.product__id, 'product').id}`" @click="$emit('show-cart-drawer')">
            <nuxt-img :src="mediaPath(item.product_info?.product.get_main_image.original, '/placeholder.svg')" class="w-full rounded-md" />
          </nuxt-link-locale >
        </div>

        <div id="infos">
          <nuxt-link-locale  id="link-product-body" :to="`/shop/${associatedValue(item.product__id, 'product').id}`" @click="$emit('show-cart-drawer')">
            <p class="mb-1 font-light text-sm">
              {{ associatedValue(item.product__id, 'product').name }}
            </p>

            <div class="font-bold">
              {{ $n(parseFloat(associatedValue(item.product__id, 'product').get_price), 'currency') }}
            </div>
            
            <div class="font-light mb-1 flex justify-start align-center gap-1">
              <span v-if="item.size">
                {{ item.size }}
              </span>

              <span>
                {{ item?.quantity }}x
              </span>
            </div>
          </nuxt-link-locale >

          <div id="actions" class="mt-5">
            <volt-button v-if="isEditable" id="action-edit-product" variant="light" class="me-2 rounded-full" size="sm" @click="handleProductEdition(item)">
              <icon name="i-lucide:pen" />
            </volt-button>

            <volt-button id="action-delete-product" variant="light" class="rounded-full" size="sm" @click="proxyDeleteFromCart(item)">
              <icon name="i-lucide:trash" />
            </volt-button>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { ProductToEdit } from '~/types'

defineProps<{ isEditable?: boolean }>()
const emit = defineEmits<{ 'edit-product': [editedProduct: ProductToEdit], 'show-cart-drawer': [] }>()

// const { gtag } = useGtag()
const cartStore = useCart()
const { mediaPath } = useDjangoUtilies()

const { statistics, associatedValue } = await useCartInformation()

console.log('iterator.statistics', statistics)

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

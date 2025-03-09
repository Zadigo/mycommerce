<template>
  <div class="my-1">
    <article v-for="item in cartItems" :key="item.product__id" :aria-label="item.product__name" class="border-2 border-gray-50 rounded-md p-3">
      <div class="flex justify-start gap-3">
        <div id="image" class="w-2/4">
          <NuxtLink :to="`/shop/${item.product__id}`" @click="$emit('show-cart-drawer')">
            <NuxtImg :src="mediaPath(item.product_info?.product.get_main_image.original, '/placeholder.svg')" class="w-full rounded-md" />
          </NuxtLink>
          <!-- FIXME: Raises an error when there is not image -->
          <!-- <v-img :src="mediaPath(item.product_info?.product.get_main_image.original)" :alt="item.product__name" :width="150" :height="150" /> -->
        </div>

        <div id="infos">
          <NuxtLink :to="`/shop/${item.product__id}`" @click="$emit('show-cart-drawer')">
            <p class="mb-1">
              {{ item.product__name }}
            </p>

            <div class="font-bold">
              {{ $n(parseFloat(item.product_info?.price), 'currency') }}
            </div>
            
            <div class="font-light mb-1 flex justify-start align-center gap-1">
              <span v-if="item.product_info">
                {{ item.product_info.size }}
              </span>

              <span>
                {{ item.quantity }}x
              </span>
            </div>
          </NuxtLink>

          <div id="actions">
            <v-btn v-if="isEditable" class="me-2" size="x-small" variant="tonal" rounded @click="handleProductEdition(item)">
              <font-awesome icon="pen" />
            </v-btn>

            <v-btn variant="tonal" size="x-small" rounded @click="deleteFromCart(item, callbackRemoveFromCart, callbackAuth)">
              <font-awesome icon="trash" />
            </v-btn>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script lang="ts" setup>
import type { LoginApiResponse } from '~/composables/django_client';
import type { CartUpdateApiResponse, ProductToEdit } from '~/types';

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

const cartStore = useCart()

// const { gtag } = useGtag()
const { mediaPath } = useDjangoUtilies()
const { deleteFromCart } = useCartComposable()

const { sessionCache } = storeToRefs(cartStore)

// Computed property that get the items from the session
// and iterates on each statistic object to be displayed 
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

// Function to open the product edition drawer
function handleProductEdition (item: ProductToEdit) {
  emit('edit-product', item)
}

/**
 * TODO: 
 */
function callbackRemoveFromCart (deletedItem: ProductToEdit, updatedCart: CartUpdateApiResponse) {
  const items = [
    {
      item_id: deletedItem.product__id,
      item_name: deletedItem.product__name,
      item_category: null,
      item_category2: null,
      price: deletedItem.total,
      quantity: deletedItem.quantity
    }
  ]

  // gtag('event', 'remove_from_cart', {
  //   currency: 'EUR',
  //   value: updatedCart.total,
  //   items
  // })

  // useTrackEvent('remove_from_cart', {
  //   currency: 'EUR',
  //   checkout_step: 1,
  //   items
  // })
}

/**
 * 
 */
function callbackAuth (data: LoginApiResponse) {
  console.log('cart > iterator > callbackAuth', data)
}
</script>

<template>
  <div class="col-12">
    <article v-for="item in cartItems" :key="item.product__id" :aria-label="item.product__name" class="card shadow-none border mb-1">
      <div class="card-body p-2">
        <div class="d-flex justify-content-start gap-2">
          <div class="col-auto">
            <v-img :src="mediaPath(item.product_info?.product.get_main_image.original)" :alt="item.product__name" :width="150" :height="150" />
          </div>

          <div class="infos">
            <NuxtLink :to="`/shop/${item.product__id}`" class="link-dark" @click="$emit('show-cart-drawer')">
              <p class="mb-1">
                {{ item.product__name }}
              </p>

              <div class="fw-bold">
                {{ $n(parseFloat(item.product_info.price), 'currency') }}
              </div>
              
              <div class="fs-light fs-6 mb-1 d-flex justify-content-start align-items-center gap-3">
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
      </div>
    </article>
  </div>
</template>

<script lang="ts" setup>
import type { CartUpdateAPIResponse, LoginAPIResponse, ProductToEdit } from '~/types';

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
const { gtag } = useGtag()
const { mediaPath } = useDjangoUtilies()
const { cache } = storeToRefs(cartStore)
const { deleteFromCart } = useCartComposable()

 /**
   * Computed property that get the items from the session
   * and iterates on each statistic object to be displayed 
   * 
   * TODO: Refactor this function
   */
const cartItems = computed((): ProductToEdit[] => {
  const cachedCart = cache.value || {}
  const statistics = cachedCart.statistics || []
  
  return statistics.map((item) => {
    const productInfo = cachedCart.results.find((cartItem) => {
      return cartItem.product.id === item.product__id
    })

    return { ...item, product_info: productInfo }
  })
})

/**
 * Function to open the product edition drawer
 */
function handleProductEdition (item: ProductToEdit) {
  emit('edit-product', item)
}

/**
 * TODO: 
 */
function callbackRemoveFromCart (deletedItem: ProductToEdit, updatedCart: CartUpdateAPIResponse) {
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

  gtag('event', 'remove_from_cart', {
    currency: 'EUR',
    value: updatedCart.total,
    items
  })

  useTrackEvent('remove_from_cart', {
    currency: 'EUR',
    checkout_step: 1,
    items
  })
}

/**
 * 
 */
function callbackAuth (data: LoginAPIResponse) {
  console.log('cart > iterator > callbackAuth', data)
}
</script>

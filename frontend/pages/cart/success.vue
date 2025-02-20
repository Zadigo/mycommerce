<template>
  <div class="row">
    <div class="col-12">
      <div class="card shadow-sm">
        <div class="card-body">
          <h1>Success</h1>

          <NuxtLink to="/">
            Back to home
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="col-12">
      <BaseRecommendations :quantity="10" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSessionStorage } from '@vueuse/core'
import type { CartUpdateAPIResponse, ProductStock } from '~/types';

definePageMeta({
  layout: 'payment-layout',
  middleware: ['auth', 'cart']
})

useHead({
  title: 'Success'
})

const cartStore = useCart()
const cart = useSessionStorage<CartUpdateAPIResponse>('cart', null)

const { gtag } = useGtag()
const { handleError } = useErrorHandler()
const {  $client } = useNuxtApp()

async function handleUpdateStock () {
  try {
    const response = await $client.post<ProductStock[]>('stocks/update', {
      customer_order: null
    })
    console.log(response.data)
  } catch (e) {
    handleError(e)
  }
}

onMounted(async () => {
  await handleUpdateStock()

  gtag('event', 'purchase', {
    transaction_id: cartStore.sessionId,
    currency: 'EUR',
    tax: 20,
    shipping: 1,
    value: cartStore.cartTotal,
    items: cartStore.products.map((item, i) => {
      return {
        item_id: item.product.id,
        item_name: item.product.name,
        price: item.product.get_price,
        quantity: 1,
        item_brand: null,
        item_category: item.product.category,
        item_category2: item.product.sub_category,
        item_variant: item.product.color,
        index: i,
        size: item.size
      }
    })
  })

  useTrackEvent('purchase', {
    checkout_step: 4,
    currency: 'EUR',
    shipping: 1,
    value: cartStore.cartTotal
  })

  cart.value = null
  cartStore.cache = null
})
</script>

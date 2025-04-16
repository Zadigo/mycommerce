<template>
  <TailCard class="card border-none">
    <TailCardContent class="card-body">
      <h2 class="font-2xl font-bold">
        {{ $t("Choisis un mode d'expédition") }}
      </h2>

      <v-radio-group v-model="cartStore.requestData.delivery">
        <template v-if="deliveryOptions.length > 0">
          <v-radio v-for="delivery in deliveryOptions" :key="delivery.id" v-model="cartStore.requestData.delivery" :label="delivery.name" :value="delivery.name" />
        </template>

        <TailSkeleton v-else class="h-[30px] mt-5 bg-gray-50" />
      </v-radio-group>
    </TailCardContent>

    <CartNavigationCardFooter next-page="/cart/shipment" />
  </TailCard>
</template>

<script lang="ts" setup>
import { useStorage } from '@vueuse/core'
import { AxiosError } from 'axios'
import type { DeliveryOption } from '~/types'
import type { NewIntentAPIResponse } from './payment'

definePageMeta({
  layout: 'cart',
  middleware: ['cart']
})

useHead({
  title: 'Shipment',
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})

const { handleError } = useErrorHandler()
const cartStore = useCart()
const { $client } = useNuxtApp()
// const { gtag } = useGtag()

const deliveryOptions = useStorage<DeliveryOption[]>('deliveryOptions', [])
const paymentIntent = useCookie<NewIntentAPIResponse>('paymentIntent')

/**
 * Get the delivery options from which the
 * user can choose from in order to deliver
 * the products 
 */
async function requestDeliveryOptions () {
  try {
    if (!deliveryOptions.value) {
      const response = await $client.get<DeliveryOption[]>('orders/delivery-options')
      deliveryOptions.value = response.data
    }
  } catch (e) {
    if (e instanceof AxiosError && e.response) {
      // Handle error
    }
  }
}

/**
 * Requests a new payment intent and returns an
 * intent ID that will be used to confirm the payment
 * on the actual payment page
 */
async function handleNewPaymentIntent () {
  try {
    if (!paymentIntent.value) {
      const response = await $client.post<NewIntentAPIResponse>('/api/v1/orders/intent', {
        session_id: cartStore.sessionId
      })
      paymentIntent.value = response.data
    }
  } catch (e) {
    handleError(e)
  }
}

onMounted(async () => {
  await requestDeliveryOptions()
  await handleNewPaymentIntent()

  // TODO: G-Analytics
  // gtag('event', 'begin_checkout', {
  //   value: cartStore.cartTotal,
  //   currency: 'EUR',
  //   items: cartStore.products.map((item, i) => {
  //     return {
  //       item_id: item.product.id,
  //       item_name: item.product.name,
  //       price: item.product.get_price,
  //       quantity: 1,
  //       item_brand: null,
  //       item_category: item.product.category,
  //       item_category2: item.product.sub_category,
  //       item_variant: item.product.color,
  //       index: i,
  //       size: item.size
  //     }
  //   })
  // })

  // useTrackEvent('begin_checkout', {
  //   transaction_id: cartStore.sessionId,
  //   checkout_step: 1,
  //   currency: 'EUR',
  //   shipping: 1
  // })
})
</script>

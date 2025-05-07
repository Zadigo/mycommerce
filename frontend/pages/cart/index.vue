<template>
  <TailCard class="card border-none">
    <TailCardContent class="card-body">
      <h2 class="font-2xl font-bold">
        {{ $t("Choisis un mode d'expédition") }}
      </h2>

      <TailRadioGroup v-if="deliveryOptions.length > 0" v-model="cartStore.requestData.delivery" default-value="Relais colis">
        <div v-for="(delivery, i) in deliveryOptions" :key="delivery.id" class="flex items-center space-x-8">
          <TailRadioGroupItem :id="`delivery-${i}`" :value="delivery.id" />
          <TailLabel :for="`delivery-${i}`">
            {{ delivery.name }}
          </TailLabel>
        </div>
      </TailRadioGroup>
      <TailSkeleton v-else class="h-[30px] mt-5 bg-gray-50" />
    </TailCardContent>

    <CartNavigationCardFooter next-page="/cart/shipment" />
  </TailCard>
</template>

<script lang="ts" setup>
import { useStorage } from '@vueuse/core'
import type { DeliveryOption } from '~/types'
import type { NewIntentAPIResponse } from '../../types/cart/payment'

definePageMeta({
  layout: 'cart',
  middleware: ['cart']
})

const { t } = useI18n()
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
const { data } = useAsyncData('delivery-options', async () => {
  return await Promise.all(
    [
      await $client<DeliveryOption[]>('/api/v1/orders/delivery-options', {
        method: 'GET',
        baseURL: useRuntimeConfig().public.quartProdUrl,
        onRequestError() {
          console.log('TODO: Point to the Quart backend')
        }
      }),

      /**
       * Requests a new payment intent and returns an
       * intent ID that will be used to confirm the payment
       * on the actual payment page
       */
      await $client<NewIntentAPIResponse>('/api/v1/orders/intent', {
        method: 'POST',
        body: {
          session_id: cartStore.sessionId
        },
        onRequestError({ error }) {
          handleError(error)
        }
      })
    ]
  )
})

if (data.value) {
  deliveryOptions.value = data.value[0]
  paymentIntent.value = data.value[1]
}

onMounted(async () => {
  // await handleNewPaymentIntent()

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

useHead({
  title: t('Options de livraison'),
  meta: [
    {
      key: 'description',
      content: t('Choississez votre option de livraison')
    }
  ]
})
</script>

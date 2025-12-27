<template>
  <volt-card class="border-none">
    <template>
      <h2 class="font-2xl font-bold">
        {{ $t("Choisis un mode d'expédition") }}
      </h2>

      <template v-if="deliveryOptions.length > 0">
        <volt-label v-for="(delivery, i) in deliveryOptions" :key="delivery.id" :label-for="delivery.id">
          <volt-radio-button v-model="shipping" :value="delivery.id" :id="delivery.id" />
        </volt-label>
      </template>
      <volt-skeleton v-else height="3rem" />
    </template>

    <template #footer>
      <CartNavigationCardFooter next-page="/cart/shipment" />
    </template>
  </volt-card>
</template>

<script lang="ts" setup>
import { useStorage } from '@vueuse/core'
import type { DeliveryOption } from '~/types/api/cart/payment'

definePageMeta({
  title: 'Cart: Index',
  layout: 'cart',
  middleware: ['cart']
})

const { t } = useI18n()
const { customHandleError } = useErrorHandler()

const { shipping } = useShippingComposable()

// const { gtag } = useGtag()

const deliveryOptions = useStorage<DeliveryOption[]>('deliveryOptions', [])
  
/**
 * Get the delivery options from which the
 * user can choose from in order to deliver
 * the products 
 */
const { $client } = useNuxtApp()
const { data } = await useAsyncData('delivery-options', async () => {
  return await Promise.all(
    [
      $client<DeliveryOption[]>('/api/v1/orders/delivery-options', {
        method: 'GET',
        baseURL: useRuntimeConfig().public.quartProdUrl,
        onRequestError() {
          console.log('TODO: Point to the Quart backend')
        }
      })
    ]
  )
})

if (data.value) {
  deliveryOptions.value = data.value[1]
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

/**
 * SEO
 */

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

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
      <cart-navigation-card-footer next-page="/cart/shipment" />
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

<template>
  <volt-card>
    <template #content>
      <keep-alive>
        <form @submit.prevent>
          <h2 class="font-bold text-2xl mb-5">
            {{ $t("Adresse de livraison") }}
          </h2>

          <volt-input-text v-model="shippingInfo.address_line" class="w-full" placeholder="Addresse" autocomplete="street-address" />
          <volt-input-text v-model="shippingInfo.city" class="w-full my-1" placeholder="Ville" autocomplete="address-level1" />

          <div class="flex justify-between gap-1">
            <volt-input-text v-model="shippingInfo.zip_code" class="w-full" placeholder="Zip code" autocomplete="postal-code" />
            <volt-input-text v-model="shippingInfo.country" autocomplete="country" />
          </div>

          <volt-divider class="my-10" />

          <h2 class="font-bold text-2xl mb-5">
            {{ $t("Mes données") }}
          </h2>

          <div class="flex justify-between gap-1">
            <volt-input-text v-model="shippingInfo.firstname" class="w-full" placeholder="Nom" autocomplete="family-name" />
            <volt-input-text v-model="shippingInfo.lastname" class="w-full" placeholder="Prénom" autocomplete="given-name" />
          </div>

          <div class="flex justify-between gap-2 my-2">
            <volt-input-text v-model="shippingInfo.email" class="w-full" type="email" placeholder="Email" autocomplete="email" />
            <volt-input-text v-model="shippingInfo.telephone" class="w-full" placeholder="Téléphone" autocomplete="tel" />
          </div>

          <volt-label label-for="create-address-set" class="mt-2">
            <volt-toggle-switch id="create-address-set" v-model="saveDetails" />
            <template #label>
              {{ $t('Sauvegarder mes données') }}
            </template> 
          </volt-label>
        </form>
      </keep-alive>
    </template>

    <template #footer>
      <CartNavigationCardFooter next-page="/cart/payment" @navigate:next-page="handleUpdatePaymentIntent" />
    </template>
  </volt-card>
</template>

<script lang="ts" setup>
import type { PaymentIntentApiResponse } from '~/types'

definePageMeta({
  title: 'Cart: Shipment',
  layout: 'cart',
  middleware: ['cart']
})

// const { gtag } = useGtag()

// TODO: G-Analytics
// gtag('event', 'add_shipping_info', {
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

/**
 * New Address form
 */

const { shippingInfo, saveDetails } = useShippingComposable()

/**
 * Payment Intent update
 */

const { $client } = useNuxtApp()

const paymentIntent = useState<PaymentIntentApiResponse>('paymentIntent')

const { customHandleError } = useErrorHandler()
const { sessionId } = useSession()

async function handleUpdatePaymentIntent() {
  
  if (isDefined(sessionId)) {
    shippingInfo.value.session_id = sessionId.value

    await $client('/api/v1/orders/intent/update', {
      method: 'POST',
      baseURL: useRuntimeConfig().public.prodDomain,
      body: {
        intent: paymentIntent.value.intent,
        ...shippingInfo.value
      },
      onRequestError({ error }) {
        customHandleError(error)
      }
    })

    // TODO: G-Analytics
    // useTrackEvent('add_shipping_info', {
    //   transaction_id: cartStore.sessionId,
    //   checkout_step: 2,
    //   currency: 'EUR',
    //   shipping: 1
    // })
  }
}

/**
 * SEO
 */

useHead({
  title: 'Cart: Shipment',
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})
</script>

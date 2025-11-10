<template>
  <volt-card>
    <template #content>
      <keep-alive>
        <form @submit.prevent>
          <h2 class="font-bold text-2xl mb-5">
            {{ $t("Adresse de livraison") }}
          </h2>

          <volt-input-text v-model="newShippingInfo.address_line" class="w-full" placeholder="Addresse" autocomplete="street-address" />
          <volt-input-text v-model="newShippingInfo.city" class="w-full my-1" placeholder="Ville" autocomplete="address-level1" />

          <div class="flex justify-between gap-1">
            <volt-input-text v-model="newShippingInfo.zip_code" class="w-full" placeholder="Zip code" autocomplete="postal-code" />
            <volt-input-text v-model="newShippingInfo.country" autocomplete="country" />
          </div>

          <volt-divider class="my-10" />

          <h2 class="font-bold text-2xl mb-5">
            {{ $t("Mes données") }}
          </h2>

          <div class="flex justify-between gap-1">
            <volt-input-text v-model="newShippingInfo.firstname" class="w-full" placeholder="Nom" autocomplete="family-name" />
            <volt-input-text v-model="newShippingInfo.lastname" class="w-full" placeholder="Prénom" autocomplete="given-name" />
          </div>

          <div class="flex justify-between gap-2 my-2">
            <volt-input-text v-model="newShippingInfo.email" class="w-full" type="email" placeholder="Email" autocomplete="email" />
            <volt-input-text v-model="newShippingInfo.telephone" class="w-full" placeholder="Téléphone" autocomplete="tel" />
          </div>

          <volt-label label-for="create-address-set" class="mt-2">
            <volt-toggle-switch id="create-address-set" v-model="saveShipmentDetails" />
            <template #label>
              {{ $t('Sauvegarder mes données') }}
            </template> 
          </volt-label>
        </form>
      </keep-alive>
    </template>

    <template #footer>
      <!-- @navigate:next-page="handleNewPaymentIntent" -->
      <CartNavigationCardFooter next-page="/cart/payment" @navigate:next-page="handleUpdatePaymentIntent" />
    </template>
  </volt-card>
</template>

<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core'
import type { NewIntentAPIResponse } from '~/types/cart/payment'

definePageMeta({
  title: 'Cart: Shipment',
  layout: 'cart',
  middleware: ['cart']
})

/**
 * New Address form
 */

// const { gtag } = useGtag()
const { $client } = useNuxtApp()


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

const saveShipmentDetails = ref(false)

const shippingStore = useShippingInfo()
const { newShippingInfo } = storeToRefs(shippingStore)

/**
 * Payment Intent from localStorage
 */

const paymentIntent = useLocalStorage<NewIntentAPIResponse>('paymentIntent', null, {
  deep: true,
  serializer: {
    read(raw) {
      return JSON.parse(raw)
    },
    write(value) {
      return JSON.stringify(value)
    }
  }
})

/**
 * Create new Address
 */

const { execute } = useAsyncData('intent', () => $fetch('/api/v1/address-set/create', {
  method: 'POST',
  baseURL: useRuntimeConfig().public.prodDomain,
  body: newShippingInfo.value,
  immediate: false
}))

/**
 * Payment Intent update
 */

const { customHandleError } = useErrorHandler()
const { djangoSessionId } = await useStorageSetup()

async function handleUpdatePaymentIntent() {
  
  if (isDefined(djangoSessionId)) {
    newShippingInfo.value.session_id = djangoSessionId.value

    await $client('/api/v1/orders/intent/update', {
      method: 'POST',
      baseURL: useRuntimeConfig().public.prodDomain,
      body: {
        intent: paymentIntent.value.intent,
        ...newShippingInfo.value
      },
      onRequestError({ error }) {
        customHandleError(error)
      }
    })

    await execute()
  
    // TODO: G-Analytics
    // useTrackEvent('add_shipping_info', {
    //   transaction_id: cartStore.sessionId,
    //   checkout_step: 2,
    //   currency: 'EUR',
    //   shipping: 1
    // })
  }
}

// onBeforeRouteLeave((to, from, next) => {
//   if (to.path === '/cart/payment') {
//     if (saveShipmentDetails.value) {
//       console.log('Save new address set')
//     }
//   }
// })

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

<template>
  <tail-card class="card border-none">
    <tail-card-content>
      <KeepAlive>
        <form @submit.prevent>
          <h2 class="font-bold text-2xl">
            {{ $t("Adresse de livraison") }}
          </h2>

          <tail-input v-model="newShippingInfo.address_line" placeholder="Addresse" autocomplete="street-address" />
          <tail-input v-model="newShippingInfo.city" placeholder="Ville" autocomplete="address-level1" class="my-1" />

          <div class="flex justify-between gap-1">
            <tail-input v-model="newShippingInfo.zip_code" placeholder="Zip code" autocomplete="postal-code" />
            <tail-input v-model="newShippingInfo.country" autocomplete="country" />
          </div>

          <hr class="my-5">

          <h2 class="font-bold text-2xl">
            {{ $t("Mes données") }}
          </h2>

          <div class="flex justify-between gap-1">
            <tail-input v-model="newShippingInfo.firstname" placeholder="Nom" autocomplete="family-name" />
            <tail-input v-model="newShippingInfo.lastname" placeholder="Prénom" autocomplete="given-name" />
          </div>

          <div class="flex justify-between gap-2 my-2">
            <tail-input v-model="newShippingInfo.email" type="email" placeholder="Email" autocomplete="email" />
            <tail-input v-model="newShippingInfo.telephone" placeholder="Téléphone" autocomplete="tel" />
          </div>

          <div class="flex items-center space-x-2">
            <TailSwitch id="create-address-set" v-model="saveShipmentDetails" />
            <TailLabel for="create-address-set">{{ $t('Sauvegarder mes données') }}</TailLabel>
          </div>
        </form>
      </KeepAlive>
    </tail-card-content>

    <!-- @navigate:next-page="handleNewPaymentIntent" -->
    <CartNavigationCardFooter next-page="/cart/payment" @navigate:next-page="handleUpdatePaymentIntent" />
  </tail-card>
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
const { customHandleError } = useErrorHandler()
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

const { djangoSessionId } = useDjangoSession()

const shippingStore = useShippingInfo()
const { newShippingInfo } = storeToRefs(shippingStore)

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
 * Update an existing payment intent
 */
async function handleUpdatePaymentIntent() {
  try {
    newShippingInfo.value.session_id = djangoSessionId.value

    await $client('/api/v1/orders/intent/update', {
      method: 'POST',
      body: {
        intent: paymentIntent.value.intent,
        ...newShippingInfo.value
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
  } catch (e) {
    customHandleError(e)
  }
}

/**
 * Create new Address
 */

const { execute } = useAsyncData(() => $fetch('/api/v1/address-set/create', {
  method: 'POST',
  body: newShippingInfo.value,
  immediate: false
}))

onBeforeRouteLeave((to, from, next) => {
  if (to.path === '/cart/payment') {
    if (saveShipmentDetails.value) {
      console.log('Save new address set')
    }
  }
})

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

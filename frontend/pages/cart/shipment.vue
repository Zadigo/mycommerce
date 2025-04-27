<template>
  <TailCard class="card border-none">
    <TailCardContent>
      <KeepAlive>
        <form @submit.prevent>
          <h2 class="font-bold text-2xl">
            {{ $t("Adresse de livraison") }}
          </h2>

          <TailInput v-model="requestData.address_line" placeholder="Addresse" autocomplete="street-address" />
          <TailInput v-model="requestData.city" placeholder="Ville" autocomplete="address-level1" class="my-1" />

          <div class="d-flex justify-content-between gap-1">
            <TailInput v-model="requestData.zip_code" :rules="[ rules.postalCode ]" placeholder="Zip code" autocomplete="postal-code" />
            <TailInput v-model="requestData.country" autocomplete="country" />
          </div>

          <hr class="my-5">

          <h2 class="font-bold text-2xl">
            {{ $t("Mes données") }}
          </h2>

          <div class="flex justify-between gap-1">
            <TailInput v-model="requestData.firstname" placeholder="Nom" autocomplete="family-name" />
            <TailInput v-model="requestData.lastname" placeholder="Prénom" autocomplete="given-name" />
          </div>

          <div class="flex justify-between gap-2 my-2">
            <TailInput v-model="requestData.email" type="email" placeholder="Email" autocomplete="email" />
            <TailInput v-model="requestData.telephone" placeholder="Téléphone" autocomplete="tel" />
          </div>

          <div class="flex items-center space-x-2">
            <TailSwitch id="create-address-set" v-model="saveShipmentDetails" />
            <TailLabel for="create-address-set">{{ $t('Sauvegarder mes données') }}</TailLabel>
          </div>
        </form>
      </KeepAlive>
    </TailCardContent>

    <!-- @navigate:next-page="handleNewPaymentIntent" -->
    <CartNavigationCardFooter next-page="/cart/payment" @navigate:next-page="handleUpdatePaymentIntent" />
  </TailCard>
</template>

<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core'
import type { NewIntentAPIResponse } from '../../types/payment'

definePageMeta({
  layout: 'cart',
  middleware: ['cart']
})

useHead({
  title: 'Options de livraison',
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})

const cartStore = useCart()
const { requestData } = storeToRefs(cartStore)

const rules = {
  /**
   * Verifies that the postal code is correct
   */
  postalCode: (zipCode: string) => {
    const regex = /\d{5}/
    return regex.test(zipCode) || 'Zip code is not valid'
  }
}

// const { gtag } = useGtag()
const { handleError } = useErrorHandler()
const { $client } = useNuxtApp()

const paymentIntent = useLocalStorage<NewIntentAPIResponse>('paymentIntent', null, {
  deep: true,
  serializer: {
    read (raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    }
  }
})

const saveShipmentDetails = ref(false)

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

// $fbq('trackSingle', 'AddPaymentInfo', {})

/**
 * Update an existing payment intent
 */
async function handleUpdatePaymentIntent() {
  try {
    requestData.value.session_id = cartStore.sessionId

    await $client('/api/v1/orders/intent/update', {
      method: 'POST',
      body: {
        intent: paymentIntent.value.intent,
        ...requestData.value
      },
      onRequestError({ error }) {
        handleError(error)
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
    handleError(e)
  }
}

const { execute } = useAsyncData(() => $fetch('/api/v1/address-set/create', {
  method: 'POST',
  body: requestData.value,
  immediate: false
}))

onBeforeRouteLeave((to, from, next) => {
  if (to.path === '/cart/payment') {
    if (saveShipmentDetails.value) {
      console.log('Save new address set')
    }
  }
})
</script>

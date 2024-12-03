<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h2 class="card-title h5">
        {{ $t("Adresse de livraison") }}
      </h2>

      <v-text-field v-model="requestData.address_line" placeholder="Addresse" variant="outlined" autocomplete="street-address" />
      <v-text-field v-model="requestData.city" variant="outlined" placeholder="Ville" autocomplete="address-level1" />

      <div class="d-flex justify-content-between gap-1">
        <v-text-field v-model="requestData.zip_code" :rules="[ rules.postalCode ]" placeholder="Zip code" variant="outlined" autocomplete="postal-code" />
        <v-text-field v-model="requestData.country" variant="outlined" autocomplete="country" />
      </div>

      <hr class="my-5">

      <h2 class="card-title h5">
        {{ $t("Mes données") }}
      </h2>

      <div class="d-flex justify-content-between gap-1">
        <v-text-field v-model="requestData.firstname" placeholder="Nom" variant="outlined" autocomplete="family-name" />
        <v-text-field v-model="requestData.lastname" placeholder="Prénom" variant="outlined" autocomplete="given-name" />
      </div>

      <div class="d-flex justify-content-between gap-1">
        <v-text-field v-model="requestData.email" type="email" placeholder="Email" variant="outlined" autocomplete="email" />
        <v-text-field v-model="requestData.telephone" placeholder="Téléphone" variant="outlined" autocomplete="tel" />
      </div>

      <v-switch v-model="saveShipmentDetails" label="Sauvegarder mes données" inset />
    </div>

    <!-- @navigate:next-page="handleNewPaymentIntent" -->
    <CartNavigationCardFooter next-page="/cart/payment" @navigate:next-page="handleUpdatePaymentIntent" />
  </div>
</template>

<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core'
import { AxiosError } from 'axios'
import type { NewIntentAPIResponse } from './payment'

definePageMeta({
  layout: 'payment-layout',
  middleware: ['auth']
})

useHead({
  title: 'Options de livraison'
})

const cartStore = useCart()
const { requestData } = storeToRefs(cartStore)
const saveShipmentDetails = ref(false)
const rules = {
  /**
   * Verifies that the postal code is correct
   */
  postalCode: (zipCode: string) => {
    const regex = /\d{5}/
    return regex.test(zipCode) || 'Zip code is not valid'
  }
}
const { $client } = useNuxtApp()

const paymentIntent = useLocalStorage<NewIntentAPIResponse>('payment_intent', null, {
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

/**
 * Update an existing payment intent
 */
async function handleUpdatePaymentIntent () {
  try {
    requestData.value.session_id = cartStore.sessionId
    await $client.post('orders/intent/update', {
      intent: paymentIntent.value.intent,
      ...requestData.value
    })
  } catch (e) {
    if (e instanceof AxiosError && e.response) {
      // Handle error
    }
  }
}
</script>

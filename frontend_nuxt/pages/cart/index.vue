<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h2 class="card-title h5">
        {{ $t("Choisis un mode d'expédition") }}
      </h2>

      <v-radio-group v-model="store.requestData.delivery">
        <v-radio v-for="delivery in deliveryOptions" :key="delivery.id" v-model="store.requestData.delivery" :label="delivery.name" :value="delivery.name" />
      </v-radio-group>
    </div>

    <CartNavigationCardFooter next-page="/cart/shipment" />
  </div>
</template>

<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core';
import { AxiosError } from 'axios';
import type { DeliveryOption } from '~/types';
import type { NewIntentAPIResponse } from './payment';

definePageMeta({
  layout: 'payment-layout',
  middleware: ['auth', 'cart']
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

const store = useCart()
const { $client } = useNuxtApp()


const deliveryOptions = useLocalStorage<DeliveryOption[]>('delivery_options', null, {
  serializer: {
    read (raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    }
  }
})

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
      const response = await $client.post<NewIntentAPIResponse>('orders/intent', {
        session_id: store.sessionId
      })
      paymentIntent.value = response.data
    }
  } catch (e) {
    if (e instanceof AxiosError && e.response) {
      // Handle error
    }
  }
}

onMounted(async () => {
  await requestDeliveryOptions()
  await handleNewPaymentIntent()
})
</script>

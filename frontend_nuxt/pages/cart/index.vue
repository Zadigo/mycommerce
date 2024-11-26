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
import { watch } from 'vue';
const { stripe } = useClientStripe()

definePageMeta({
  layout: 'payment-layout',
  middleware: ['auth']
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

const { $client } = useNuxtApp()
// const deliveryOptions = ref<DeliveryOption[]>([])
const store = useCart()
const deliveryOptions = useLocalStorage<DeliveryOption[]>('delivery_options', null, {
  serializer: {
    read (raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    },
  }
})


// watch(stripe, async () => {
//   console.log(stripe.value)
//   if (stripe.value) {
//     const { clientSecret, error } = $fetch<{ clientSecret: string, error: string | null}>('/api/payment', {
//       method: 'GET'
//     })

//     if (error) {
//       return
//     }

//     console.log(clientSecret, error)
//   }
// })

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

onMounted(async () => {
  await requestDeliveryOptions()
})
</script>

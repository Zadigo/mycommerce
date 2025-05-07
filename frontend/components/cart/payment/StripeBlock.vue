<template>
  <div class="payment">
    <form class="mb-10" @submit.prevent>
      <StripeElements v-slot="{ elements }" ref="stripeElementsEl" :stripe-key="stripeKey" :instance-options="instanceOptions" :elements-options="elementsOptions">
        <StripeElement ref="cardEl" :elements="elements" :options="cardOptions" />
      </StripeElements>
    </form>

    <TailButton @click="handleStripe">
      <v-progress-circular v-if="isLoading" indeterminate />
      {{ $t('Payer somme', { n: $n(cartStore.cartTotal, 'currency') }) }}
    </TailButton>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage, useSessionStorage } from '@vueuse/core'
import { StripeElement, StripeElements } from 'vue-stripe-js'

import type { NewIntentAPIResponse, PaymentType, StripeTokenResponse } from '~/types'

interface TokenData {
  session_id: string | null | undefined
  card: string | null
  intent: string | null
  token: string | null
  client_ip: string | null
}

const emit = defineEmits({
  'payment-complete'(_blockName: PaymentType) {
    return true
  }
})

const cartStore = useCart()
const { $client } = useNuxtApp()

const paymentResponse = useSessionStorage('paymentResponse', null, {
  serializer: {
    read (raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    }
  }
})

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

const tokenData = ref<TokenData>({
  session_id: null,
  card: null,
  intent: null,
  token: null,
  client_ip: null
})

const isLoading = ref(false)

// https://stripe.com/docs/js/initializing#init_stripe_js-options
const instanceOptions = ref({})

// https://stripe.com/docs/js/elements_object/create#stripe_elements-options
const elementsOptions = ref({})

// https://stripe.com/docs/stripe.js#element-options
const cardOptions = ref({
  defaultValues: {
    mode: 'shipping',
    firstName: null,
    lastName: null,
    address: {
      line1: null,
      line2: null,
      city: null,
      state: null,
      postal_code: null,
      country: 'France'
    },
    phone: null
  }
})

const cardEl = ref()
const stripeElementsEl = ref()

console.log(cardEl.value, stripeElementsEl.value)

const stripeKey = computed(() => {
  if (import.meta.env.DEV) {
    return useRuntimeConfig().public.stripeTestPublishableKey
  } else {
    return useRuntimeConfig().public.stripeTestPublishableKey
  }
})

console.log(stripeKey)

/**
 * @link https://github.com/ectoflow/vue-stripe-js 
 */
async function handleStripe () {
  // Test card number: 4242424242424242
  // Test card number: 4000056655665556
  // Test card number: 5200828282828210
  isLoading.value = true

  const result = await stripeElementsEl.value.instance.createToken(cardEl.value.stripeElement) as StripeTokenResponse

  if (paymentIntent.value) {
    tokenData.value.session_id = cartStore.sessionId
    tokenData.value.card = result.token.card.id
    tokenData.value.intent = paymentIntent.value.intent
    tokenData.value.token = result.token.id
    tokenData.value.client_ip = result.token.client_ip
    await handlePayment()
  } else {
    console.error('No payment intent')
  }
}

const { handleError } = useErrorHandler()

/**
 * 
 */
async function handlePayment () {
  try {
    const response = await $client('/api/v1/orders/create', {
      method: 'POST',
      body: tokenData.value
    })

    paymentResponse.value = response
    isLoading.value = false
    paymentIntent.value = null

    emit('payment-complete', 'Stripe')
  } catch (e) {
    console.log(e)
    handleError(e)
  }
}
</script>

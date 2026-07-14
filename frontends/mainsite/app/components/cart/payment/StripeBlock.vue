<template>
  <div class="payment">
    <form class="mb-10" @submit.prevent>
      <StripeElements v-slot="{ elements }" ref="stripeElementsEl" :stripe-key="stripeKey" :instance-options="instanceOptions" :elements-options="elementsOptions">
        <StripeElement ref="cardEl" :elements="elements" :options="cardOptions" />
      </StripeElements>
    </form>

    <volt-button @click="handleStripe">
      <v-progress-circular v-if="isLoading" indeterminate />
      {{ $t('Payer somme', { n: $n(cartSession?.total || 0, 'currency') }) }}
    </volt-button>
  </div>
</template>

<script setup lang="ts">
import { useSessionStorage } from '@vueuse/core'
import { StripeElement, StripeElements } from 'vue-stripe-js'
import type { PaymentIntentApiResponse, DefaultPaymentProviders, StripeTokenResponse } from '~/types'

interface TokenData {
  session_id: string | null | undefined
  card: string | null
  paymentIntentId: string | null
  token: string | null
  client_ip: string | null
  customer_id: string | null
}

const emit = defineEmits<{ 'payment-complete': [blockName: DefaultPaymentProviders] }>()

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

const stripeId = useState<string>('stripeId')

/**
 * Cart
 */

const { cartSession } = useCartComposable()
const tokenData = ref<TokenData>({
  session_id: null,
  card: null,
  paymentIntentId: null,
  token: null,
  client_ip: null,
  customer_id: null
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

console.log("Stripe Key", stripeKey.value)

/**
 * Payment
 */

const { sessionId } = useSession()
const { paymentIntent, reset } = usePaymentIntentComposable()

// https://github.com/ectoflow/vue-stripe-js 
async function handleStripe() {
  // Test card number: 4242424242424242
  // Test card number: 4000056655665556
  // Test card number: 5200828282828210
  isLoading.value = true

  const result = await stripeElementsEl.value.instance.createToken(cardEl.value.stripeElement) as StripeTokenResponse

  if (paymentIntent.value) {
    tokenData.value.session_id = sessionId.value
    tokenData.value.card = result.token.card.id
    tokenData.value.paymentIntentId = paymentIntent.value
    tokenData.value.token = result.token.id
    tokenData.value.client_ip = result.token.client_ip
    tokenData.value.customer_id = stripeId.value
    await handlePayment()
  } else {
    console.error('No payment intent')
  }
}

async function handlePayment () {  
  const response = await $fetch<PaymentIntentApiResponse>('/api/payment/capture', {
    method: 'POST',
    body: toValue(tokenData)
  })

  paymentResponse.value = response
  isLoading.value = false

  reset()

  emit('payment-complete', 'Stripe')
}
</script>

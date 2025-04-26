<template>
  <TailCard class="card shadow-sm">
    <TailCardContent>
      <p class="fw-light">
        {{ $t('Choississez votre mode de paiement') }}
      </p>

      <div class="list-group">
        <a v-for="paymentMethod in paymentMethods" :key="paymentMethod.name" href="#" :class="{ active: selectedPaymentMethod === paymentMethod.name }" class="list-group-item list-group-item-action p-3" @click.prevent="handlePaymentType(paymentMethod.name)">
          <font-awesome :icon="['fab', paymentMethod.icon]" class="me-3" />
          {{ paymentMethod.name }}
        </a>
      </div>

      <hr v-if="hasSelectedPaymentMethod" class="my-5">

      <div v-if="hasSelectedPaymentMethod && selectedPaymentMethod !== 'Klarna'" class="payment">
        <div class="p-4">
          <form @submit.prevent>
            <StripeElements v-slot="{ elements }" ref="stripeElementsEl" :stripe-key="stripeKey" :instance-options="instanceOptions" :elements-options="elementsOptions">
              <StripeElement ref="cardEl" :elements="elements" :options="cardOptions" />
            </StripeElements>
          </form>
        </div>

        <button type="button" class="btn btn-block btn-primary btn-rounded shadow-none fs-5 fw-bold" @click="handleStripe">
          <v-progress-circular v-if="isLoading" indeterminate />
          {{ $t('Payer somme', { n: $n(cartStore.cartTotal, 'currency') }) }}
        </button>
      </div>

      <div v-else-if="hasSelectedPaymentMethod && selectedPaymentMethod === 'Klarna'" id="klarna-payments-container" />
    </TailCardContent>

    <TailCardContent class="flex gap-1 items-center justify-center">
      <v-img src="/cards/mastercard.svg" height="30" width="30" />
      <v-img src="/cards/visa.png" height="30" width="30" />
    </TailCardContent>
  </TailCard>
</template>

<script lang="ts" setup>
import { useLocalStorage, useSessionStorage } from '@vueuse/core'
import { AxiosError } from 'axios'
import { StripeElement, StripeElements } from 'vue-stripe-js'

import type { NewIntentAPIResponse, StripeTokenResponse } from './payment'

interface TokenData {
  session_id: string | null | undefined
  card: string | null
  intent: string | null
  token: string | null
  client_ip: string | null
}

definePageMeta({
  layout: 'cart',
  middleware: ['cart']
})

useHead({
  title: 'Payment',
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})

const paymentMethods = [
  {
    name: 'Visa / Mastercard',
    icon: 'cc-mastercard'
  },
  {
    name: 'Klarna',
    icon: 'klarna'
  }
]

const cartStore = useCart()

const selectedPaymentMethod = ref<string | null>(null)
const tokenData = ref<TokenData>({
  session_id: null,
  card: null,
  intent: null,
  token: null,
  client_ip: null
})

const { $client } = useNuxtApp()
const config = useRuntimeConfig()


const paymentResponse = useSessionStorage('payment_response', null, {
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

// const { gtag } = useGtag()
const router = useRouter()
const stripeKey = ref(config.public.STRIPE_PUBLISHABLE_KEY)

// https://stripe.com/docs/js/initializing#init_stripe_js-options
const instanceOptions = ref({})

// https://stripe.com/docs/js/elements_object/create#stripe_elements-options
const elementsOptions = ref({})

// https://stripe.com/docs/stripe.js#element-options
const cardOptions = ref({
  // value: {
  //   postalCode: '12345',
  // }
})

const isLoading = ref(false)
const cardEl = ref()
const stripeElementsEl = ref()

const hasSelectedPaymentMethod = computed(() => {
  return selectedPaymentMethod.value !== null
})

/**
 * 
 */
async function handlePayment () {
  try {
    const response = await $client('orders/create', {
      method: 'POST',
      body: tokenData.value
    })

    paymentResponse.value = response
    // cartStore.cache = null
    // cart.value = null
    isLoading.value = false
    paymentIntent.value = null

    // TODO: G-Analytics
    // gtag('event', 'add_payment_info', {
    //   transaction_id: cartStore.sessionId,
    //   currency: 'EUR',
    //   tax: 20,
    //   shipping: 1,
    //   value: cartStore.cartTotal,
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

    // useTrackEvent('add_payment_info', {
    //   checkout_step: 3,
    //   currency: 'EUR',
    //   shipping: 1,
    //   value: cartStore.cartTotal
    // })

    router.push('/cart/success')
  } catch (e) {
    if (e instanceof AxiosError && e.response) {
      isLoading.value = false
    }
  }
}

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

/**
 * Executes card tokenization and initiates the
 * payment on the backend side
 */
function handlePaymentType (cardType: string) {
  selectedPaymentMethod.value = cardType
}
</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons>
        <ion-nav-link router-direction="back">
          <ion-back-button :text="''" />
        </ion-nav-link>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-grid>
      <ion-row>
        <StripeElements v-slot="{ elements }" ref="stripeElementsEl" :stripe-key="stripeKey" :instance-options="instanceOptions" :elements-options="elementsOptions">
          <StripeElement ref="cardEl" :elements="elements" :options="cardOptions" />
        </StripeElements>

        <!-- <ion-col size="12">
          <ion-input type="text" fill="outline" placeholder="Numéro de carte" autocomplete="cc-number" />
        </ion-col>

        <ion-col size="6">
          <ion-input type="text" fill="outline" placeholder="Expiration" autocomplete="cc-exp" />
        </ion-col>

        <ion-col size="6">
          <ion-input type="text" fill="outline" placeholder="CVC" autocomplete="cc-csc" />
        </ion-col>

        <ion-col size="12">
          <ion-input type="text" fill="outline" placeholder="Nom complet" autocomplete="name" />
        </ion-col> -->

        <ion-button @click="handleStripe">
          Procéder au paiement
        </ion-button>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script setup lang="ts">
import { useErrorHandler } from '@/composables/errors';
import { useAxiosClient } from '@/plugins/client';
import { useCart } from '@/stores/cart';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonGrid,
  IonHeader,
  IonNavLink,
  IonRow,
  IonToolbar
} from '@ionic/vue';
import { useLocalStorage, useSessionStorage } from '@vueuse/core';
import { ref } from 'vue';
import { StripeElement, StripeElements } from 'vue-stripe-js';
import type { NewIntentAPIResponse, StripeTokenResponse } from '../payment';

interface TokenData {
  session_id: string | null | undefined
  card: string | null
  intent: string | null
  token: string | null
  client_ip: string | null
}

const cartStore = useCart()

const selectedPaymentMethod = ref<string | null>(null)
const tokenData = ref<TokenData>({
  session_id: null,
  card: null,
  intent: null,
  token: null,
  client_ip: null
})

const stripeKey = ref(import.meta.env.STRIPE_PUBLISHABLE_KEY)

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
const { handleError } = useErrorHandler()

const { client } = useAxiosClient()

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
 * 
 */
async function handlePayment () {
  try {
    const response = await client.post('orders/create', tokenData.value)

    paymentResponse.value = response.data
    // cartStore.cache = null
    // cart.value = null
    isLoading.value = false
    paymentIntent.value = null

    router.push('/cart/success')
  } catch (e) {
    console.log(e)
    handleError(e)
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

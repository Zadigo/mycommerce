<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <p class="fw-light">
        {{ $t('Choississez votre mode de paiement') }}
      </p>

      <div class="list-group">
        <a v-for="paymentMethod in paymentMethods" :key="paymentMethod.name" href="#" :class="{ active: selectedPaymentMethod === paymentMethod.name }" class="list-group-item list-group-item-action p-3" @click.prevent="handlePaymentType(paymentMethod.name)">
          <font-awesome-icon :icon="['fab', paymentMethod.icon]" class="me-3" />
          {{ paymentMethod.name }}
        </a>
      </div>

      <hr v-if="hasSelectedPaymentMethod" class="my-5">

      <div v-if="hasSelectedPaymentMethod && selectedPaymentMethod !== 'Klarna'" class="payment">
        <div class="p-4">
          <stripe-elements v-slot="{ elements }" ref="stripeElements" :stripe-key="stripeKey" :instance-options="instanceOptions" :elements-options="elementsOptions">
            <stripe-element ref="card" :elements="elements" :options="cardOptions" />
          </stripe-elements>
        </div>

        <button type="button" class="btn btn-block btn-primary btn-rounded shadow-none fs-5 fw-bold" @click="handleStripe">
          {{ $t('Payer somme', { n: translatePrice(cartStore.cartTotal) }) }}
        </button>
      </div>
      <div v-else-if="hasSelectedPaymentMethod && selectedPaymentMethod === 'Klarna'" id="klarna-payments-container" />
    </div>

    <div class="card-body d-flex gap-1 align-items-center justify-content-center">
      <v-img src="/cards/mastercard.svg" height="30" width="30" />
      <v-img src="/cards/visa.png" height="30" width="30" />
    </div>
  </div>
</template>

<script lang="ts">
import { useVueLocalStorage } from '@/plugins/vue-storages'
import { AxiosError } from 'axios'
import { storeToRefs } from 'pinia'
import { useShopUtilities } from 'src/composables/shop'
import { useCart } from 'src/stores/cart'
import { useMessages } from 'src/stores/messages'
import { useSeoMeta } from 'unhead'
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { StripeElement, StripeElements } from 'vue-stripe-js'

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

export default defineComponent({
  name: 'PaymentPage',
  components: {
    StripeElements,
    StripeElement
  },
  setup () {
    const { t } = useI18n()
    const { instance } = useVueLocalStorage() 

    const messagesStore = useMessages()
    const cartStore = useCart()
    
    const { requestData } = storeToRefs(cartStore)

    const tokenData = ref({
      session_id: null,
      card: null,
      intent: null,
      client_ip: null
    })

    const { translatePrice } = useShopUtilities()
    
    const selectedPaymentMethod = ref<string | null>(null)

    const hasSelectedPaymentMethod = computed(() => {
      return selectedPaymentMethod.value !== null
    })

    const stripeKey = ref(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
    const instanceOptions = ref({
      // https://stripe.com/docs/js/initializing#init_stripe_js-options
    })
    const elementsOptions = ref({
      // https://stripe.com/docs/js/elements_object/create#stripe_elements-options
    })
    const cardOptions = ref({
      // https://stripe.com/docs/stripe.js#element-options
      // value: {
      //   postalCode: '12345',
      // }
    })

    useSeoMeta({
      title: t('Paiement'),
      description: t('Paiement de vos éléments de votre site'),
      robots: 'noindex,nofollow'
    })

    const paymentIntent = ref(instance.retrieve<{ intent: string }>('payment_intent'))

    return {
      paymentIntent,
      stripeKey,
      instanceOptions,
      elementsOptions,
      cardOptions,
      cartStore,
      tokenData,
      requestData,
      messagesStore,
      hasSelectedPaymentMethod,
      selectedPaymentMethod,
      paymentMethods,
      translatePrice
    }
  },
  methods: {
    /**
     * @link https://github.com/ectoflow/vue-stripe-js 
     */
    async handleStripe () {
      // Test card number: 4242424242424242
      // Test card number: 4000056655665556
      // Test card number: 5200828282828210
      const result = await this.$refs.stripeElements.instance.createToken(this.$refs.card.stripeElement)
      const token = result.token

      this.tokenData.session_id = this.$session.retrieve('session_id')
      this.tokenData.card = token.card.id
      this.tokenData.intent = this.paymentIntent.intent
      this.tokenData.token = token.id
      this.tokenData.client_ip = token.client_ip

      // this.requestData.card = this.tokenData
      // this.$session.create('payment_intent', this.tokenData.token_id)

      this.handlePayment()
    },
    /**
     * Executes card tokenization and initiates the
     * payment on the backend side
     */
    async handlePayment () {
      try {
        const response = await this.$http.post('orders/create', this.tokenData)

        this.$session.create('payment_response', response.data)
        this.$localstorage.remove('payment_intent')
        
        this.$router.push({ name: 'shop_payment_success' })
      } catch (e) {
        if (e instanceof AxiosError && e.response) {
          console.error(e)
          this.messagesStore.addErrorMessage('Payment error', e.response.statusText)
        }
      }
    },
    /**
     * Executes card tokenization and initiates the
     * payment on the backend side
     */
    handlePaymentType (cardType: string) {
      this.selectedPaymentMethod = cardType
    }
  }
})
</script>

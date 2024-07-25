<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <p class="fw-light">{{ $t('Choississez votre mode de paiement') }}</p>

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
            <stripe-element ref="card" :elements="elements" :options="cardOptions"></stripe-element>
          </stripe-elements>
        </div>

        <button type="button" class="btn btn-block btn-primary btn-rounded shadow-none fs-5 fw-bold" @click="handleStripe">
          {{ $t('Payer somme', { n: translatePrice(cartStore.cartTotal) }) }}
        </button>
      </div>
      <div v-else-if="hasSelectedPaymentMethod && selectedPaymentMethod === 'Klarna'" id="klarna-payments-container"></div>
    </div>

    <div class="card-body d-flex gap-1 align-items-center justify-content-center">
      <v-img src="/cards/mastercard.svg" height="30" width="30"></v-img>
      <v-img src="/cards/visa.png" height="30" width="30"></v-img>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { computed } from 'vue'
import { useScript } from 'unhead'
import { storeToRefs } from 'pinia'
import { useCart } from 'src/stores/cart'
import { useUtilities } from 'src/composables/shop'
import { useMessages } from 'src/stores/messages'
import { StripeElements, StripeElement } from 'vue-stripe-js'

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

export default {
  name: 'PaymentPage',
  components: {
    StripeElements,
    StripeElement
  },
  setup () {
    useScript({ src: 'https://x.klarnacdn.net/kp/lib/v1/api.js' })

    const messagesStore = useMessages()
    const cartStore = useCart()
    const { requestData } = storeToRefs(cartStore)

    const { translatePrice } = useUtilities()
    
    const selectedPaymentMethod = ref(null)

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

    return {
      stripeKey,
      instanceOptions,
      elementsOptions,
      cardOptions,
      cartStore,
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
      const result = await this.$refs.stripeElements.instance.createToken(this.$refs.card.stripeElement)
      console.log(result)
    },
    /**
     * Executes card tokenization and initiates the
     * payment on the backend side
     */
    async handlePayment () {
      try {
        const response = await this.$http.post('orders/create', this.requestData)
        this.$session.create('payment_response', response.data)
        this.$router.push({ name: 'shop_payment_success' })
      } catch (e) {
        this.messagesStore.addErrorMessage('Payment error', e.response)
        console.error(e)
      }
    },
    /**
     * Executes card tokenization and initiates the
     * payment on the backend side
     */
    handlePaymentType (cardType) {
      this.selectedPaymentMethod = cardType
    }
  }
}
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <p class="fw-light">Choississez votre mode de paiement</p>

      <div class="list-group">
        <a v-for="paymentMethod in paymentMethods" :key="paymentMethod.name" href="#" :class="{ active: selectedPaymentMethod === paymentMethod.name }" class="list-group-item list-group-item-action p-3" @click.prevent="handlePaymentType(paymentMethod.name)">
          <font-awesome-icon :icon="['fab', paymentMethod.icon]" class="me-3" />
          {{ paymentMethod.name }}
        </a>
      </div>

      <hr v-if="hasSelectedPaymentMethod" class="my-5">

      <div v-if="hasSelectedPaymentMethod && selectedPaymentMethod !== 'Klarna'" class="payment">
        <v-text-field placeholder="Card number" variant="outlined" autocomplete="cc-number"></v-text-field>

        <div class="d-flex justify-content-start gap-1">
          <v-text-field placeholder="Month" variant="outlined" autocomplete="cc-exp-month"></v-text-field>
          <v-text-field placeholder="Year" variant="outlined" autocomplete="cc-exp-year"></v-text-field>
          <v-text-field placeholder="CSV" variant="outlined" autocomplete="cc-csc"></v-text-field>
        </div>

        <button type="button" class="btn btn-block btn-primary btn-rounded shadow-none fs-5 fw-bold" @click="handlePayment">
          Payer ({{ translatePrice(cartStore.cartTotal) }})
        </button>
      </div>
      <div v-else-if="hasSelectedPaymentMethod && selectedPaymentMethod === 'Klarna'" id="klarna-payments-container"></div>
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

const paymentMethods = [
  {
    name: 'Mastercard',
    icon: 'cc-mastercard'
  },
  {
    name: 'Visa',
    icon: 'cc-visa'
  }
  // {
  //   name: 'Klarna',
  //   icon: 'klarna'
  // }
]

export default {
  name: 'PaymentPage',
  setup () {
    useScript({ src: 'https://js.stripe.com/v3' })
    useScript({ src: 'https://x.klarnacdn.net/kp/lib/v1/api.js' })

    const messagesStore = useMessages()
    const cartStore = useCart()
    const { requestData } = storeToRefs(cartStore)

    const { translatePrice } = useUtilities()
    
    const selectedPaymentMethod = ref(null)

    const hasSelectedPaymentMethod = computed(() => {
      return selectedPaymentMethod.value !== null
    })

    return {
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
        console.log(e)
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

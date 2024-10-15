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
    <navigation-card-footer next-page="shop_payment" />
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia'
import { useCart } from 'src/stores/cart'
import { useHead } from 'unhead'
import { defineComponent, ref } from 'vue'

import NavigationCardFooter from 'src/components/cart/NavigationCardFooter.vue'

export default defineComponent({
  name: 'ShipmentPage',
  components: {
    NavigationCardFooter
  },
  beforeRouteLeave (to, from, next) {
    console.log(to.name)
    if (to.name === 'shop_payment') {
      this.handleNewPaymentIntent()
    }
    next()
  },
  setup () {
    useHead({ title: 'Options de livraison' })

    const store = useCart()
    const { requestData } = storeToRefs(store)
    const saveShipmentDetails = ref(false)

    return {
      store,
      saveShipmentDetails,
      requestData,
      rules: {
        /**
         * Verifies that the postal code is correct
         */
        postalCode: (zipCode: string) => {
          const regex = /\d{5}/
          return regex.test(zipCode) || 'Zip code is not valid'
        }
      }
    }
  },
  methods: {
    /**
     * Requests a new payment intent and returns an
     * intent ID that will be used to confirm the payment
     * on the actual payment page
     */
    async handleNewPaymentIntent () {
      try {
        if (!this.$localstorage.keyExists('payment_intent')) {
          this.requestData.session_id = this.$session.retrieve<string>('session_id')
          const response = await this.$http.post('orders/intent', this.requestData)
          this.$localstorage.create('payment_intent', response.data)
        }
      } catch (e) {
        // Handle error
        console.log(e)
      }
    },
    /**
     * 
     */
    async handleSaveShipmentInfo () {
      
    }
  }
})
</script>

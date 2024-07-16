<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <!-- <h2 class="card-title h5">Enlèvement en magasin</h2> -->
      <h2 class="card-title h5">Adresse de livraison</h2>

      <v-text-field v-model="requestData.address_line" variant="outlined" autocomplete="street-address"></v-text-field>

      <div class="d-flex justify-content-between gap-1">
        <v-text-field v-model="requestData.zip_code" :rules="[ rules.postalCode ]" placeholder="Zip code" variant="outlined" autocomplete="postal-code"></v-text-field>
        <v-text-field v-model="requestData.country" variant="outlined" autocomplete="country"></v-text-field>
      </div>

      <hr class="my-5">

      <h2 class="card-title h5">Mes données</h2>
      <div class="d-flex justify-content-between gap-1">
        <v-text-field v-model="requestData.firstname" placeholder="Nom" variant="outlined" autocomplete="family-name"></v-text-field>
        <v-text-field v-model="requestData.lastname" placeholder="Prénom" variant="outlined" autocomplete="given-name"></v-text-field>
      </div>

      <div class="d-flex justify-content-between gap-1">
        <v-text-field v-model="requestData.email" type="email" placeholder="Email" variant="outlined" autocomplete="email"></v-text-field>
        <v-text-field v-model="requestData.telephone" placeholder="Téléphone" variant="outlined" autocomplete="tel"></v-text-field>
      </div>

      <v-switch label="Sauvegarder mes données" inset></v-switch>
    </div>


    <navigation-card-footer next-page="shop_payment" />
  </div>
</template>

<script>
import { useHead } from 'unhead'
import { storeToRefs } from 'pinia'
import NavigationCardFooter from 'src/components/cart/NavigationCardFooter.vue'
import { useCart } from 'src/stores/cart'

export default {
  name: 'PaymentPage',
  components: {
    NavigationCardFooter
  },
  setup () {
    useHead({
      title: 'Delivery options'
    })

    const store = useCart()
    const { requestData } = storeToRefs(store)

    return {
      store,
      requestData,
      rules: {
        /**
         * Verifies that the postal code is correct
         * 
         * @param {String} zipCode The postal code
         * @returns {Boolean} Whether the postal code is valid
         */
        postalCode: zipCode => {
          const regex = /\d{5}/
          return regex.test(zipCode) || 'Zip code is not valid'
        }
      }
    }
  }
}
</script>

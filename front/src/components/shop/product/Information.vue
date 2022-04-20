<template>
  <div id="information" class="col-12">
    <div>
      <b-link v-b-popover.click.bottom="securedTransactionText">
        <font-awesome-icon icon="lock" class="mr-2" />
        {{ $t('secured_payments') }}
      </b-link>
    </div>

    <!-- Technical Information -->
    <technical-information :product="product" />

    <!-- Add to list -->
    <v-menu v-show="isAuthenticated" :close-on-content-click="false" transition="scale-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="my-3" v-bind="attrs" v-on="on" @click="getUserLists">
          <font-awesome-icon class="mr-2" icon="star"></font-awesome-icon>
          {{ $t('Add to list') }}
        </v-btn>
      </template>

      <v-list>
        <v-list-item-group>
          <v-list-item v-for="item in wishlists" :key="item.id" @click="addToList(item)">
            {{ item.name }}
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>

    <!-- Reassurance -->
    <div class="card shadow-none border">
      <div class="card-body">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="1"><v-icon class="mr-4">mdi-truck-delivery</v-icon></v-col>
                <v-col cols="10">{{ $t('delivery_conditions', { value: $n(50, 'currency') }) }}</v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-row>
                <v-col cols="1"><v-icon class="mr-4">mdi-clock-time-nine</v-icon></v-col>
                <v-col cols="10">{{ $t('express_delivery_fee', { value: $n(50, 'currency'), fee: $n(10, 'currency') }) }}</v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>

    <!-- TODO: Delete ? -->
    <!-- <div class="bg-light p-3">
      <p class="font-weight-bold">Le saviez-vous ?</p>
      <span>
        La musique HD nécessite un service de musique en streaming compatible, 
        comme Amazon Music Unlimited.
      </span>
    </div> -->

    <!-- TODO: Delete ? -->
    <!-- <div class="bg-light p-3 rounded">
      Nos prix incluent l'éco-participation sur tous les 
      produits concernés. Vous voulez recycler votre appareil 
      électrique ou électronique gratuitement ? <b-link>En apprendre plus</b-link>
    </div> -->
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import TechnicalInformation from './TechnicalInformation.vue'

export default {
  name: 'Information',

  components: {
    TechnicalInformation
  },

  props: {
    product: {
      type: Object,
      required: true
    },
    numberOfReviews: {
      type: Number,
      default: 0
    },
    productVariants: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    returnPolicy: "Les retours gratuits sont disponibles pour l adresse d expédition que vous avez choisie. Vous pouvez retourner l article pour n importe quelle raison dans son état neuf et inutilisé, sans frais de retour.",
    securedTransactionText: "Nous nous efforçons de protéger votre sécurité et votre vie privée. Notre système de paiement sécurisé chiffre vos données lors de la transmission. Nous ne partageons pas les détails de votre carte de crédit avec les vendeurs tiers, et nous ne vendons pas vos données personnelles à autrui. En savoir plus"
  }),

  computed: {
    ...mapState({
      wishlists: (state) => { return state.shopModule.userLists }
    }),
    ...mapGetters('authenticationModule', ['isAuthenticated']),

    hasDescription() {
      return this.product == undefined
    }
  },
  
  methods: {
    async addToList (wishlist) {
      try {
        await this.axios.post('shop/lists/add', {
          product: this.product,
          wishlist: wishlist
        })

      } catch(error) {
        this.$store.dispatch('addErrorMessage', error)
      }
    },
    
    async getUserLists () {
      try {
        var response = await this.axios.get('shop/lists')

        this.$store.commit('setUserLists', response.data)
      } catch(error) {
        this.$store.dispatch('addErrorMessage', error)
      }
    },

    calculatePaymentFraction (unitPrice) {
      var price = unitPrice * 1
      return Math.floor(price / 4 * 1000) / 1000
    }
  }
}
</script>

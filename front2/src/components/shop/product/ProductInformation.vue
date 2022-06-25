<template>
  <div id="information" class="col-12">
    <div>
      <!-- <b-link v-b-popover.click.bottom="securedTransactionText">
        <font-awesome-icon icon="lock" class="mr-2" />
        {{ $t('secured_payments') }}
      </b-link> -->
    </div>

    <!-- Technical Information -->
    <!-- <technical-information :product="product" /> -->

    <!-- Add to list -->
    <!-- <v-menu v-show="isAuthenticated" :close-on-content-click="false" transition="scale-transition">
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
    </v-menu> -->

    <!-- Reassurance -->
    <div class="card shadow-none border">
      <div class="card-body">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="row">
                <div class="col-2">
                  truck
                </div>

                <div class="col-10">
                  {{ $t('Free shipping', { value: $n(50, 'currency', $i18n.locale) }) }}
                </div>
              </div>
            </div>

            <div class="col-12">
              <div class="row">
                <div class="col-2">
                  clock
                  <!-- <v-icon class="mr-4">mdi-clock-time-nine</v-icon> -->
                </div>
                <div class="col-10">
                  {{ $t('express_delivery_fee', { value: $n(50, 'currency'), fee: $n(10, 'currency') }) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card bg-light shadow-none my-2">
      <div class="card-body">
        Nos prix incluent l'éco-participation sur tous les
        produits concernés. Vous voulez recycler votre appareil
        électrique ou électronique gratuitement ? <a>En apprendre plus</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useShop } from '@/store/shop'
import { useAuthentication } from '@/store/authentication'
// import TechnicalInformation from './TechnicalInformation.vue'

export default {
  name: 'ProductInformation',
  components: {
    // TechnicalInformation
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
    returnPolicy: 'Les retours gratuits sont disponibles pour ladresse dexpédition que vous avez choisie. Vous pouvez retourner larticle pour nimporte quelle raison dans son état neuf et inutilisé, sans frais de retour.',
    securedTransactionText: 'Nous nous efforçons de protéger votre sécurité et votre vie privée. Notre système de paiement sécurisé chiffre vos données lors de la transmission. Nous ne partageons pas les détails de votre carte de crédit avec les vendeurs tiers, et nous ne vendons pas vos données personnelles à autrui. En savoir plus'
  }),
  computed: {
    ...mapState(useShop, ['userLists']),
    ...mapState(useAuthentication, ['isAuthenticated']),

    hasDescription () {
      return this.product === undefined
    }
  },
  methods: {
    async addToList (wishlist) {
      try {
        await this.axios.post('shop/lists/add', {
          product: this.product,
          wishlist: wishlist
        })
      } catch (error) {
        this.$store.dispatch('addErrorMessage', error)
      }
    },

    async getUserLists () {
      try {
        const response = await this.axios.get('shop/lists')

        this.$store.commit('setUserLists', response.data)
      } catch (error) {
        this.$store.dispatch('addErrorMessage', error)
      }
    },

    calculatePaymentFraction (unitPrice) {
      const price = unitPrice * 1
      return Math.floor(price / 4 * 1000) / 1000
    }
  }
}
</script>

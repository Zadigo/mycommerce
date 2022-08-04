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
                <div class="col-auto text-center">
                  <font-awesome-icon icon="fa-solid fa-truck-fast" />
                </div>

                <div class="col-10">
                  {{ $t('Free shipping', { value: $n(50, 'currency', $i18n.locale) }) }}
                </div>
              </div>
            </div>

            <div class="col-12 mt-3">
              <div class="row">
                <div class="col-auto text-center">
                  <font-awesome-icon icon="fa-solid fa-clock" />
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

    <!-- Details -->
    <div class="card shadow-none">
      <div class="card-body fw-light" style="overflow: hidden;">
        <h6 class="card-title text-uppercase fw-bold">{{ $t('Details') }}</h6>
        <ul>
          <li>
            Soutien-gorge à armatures, sans rembourrage.
          </li>
          <li>
            Mesh stretch brodé de fleurs et d’élastiques décoratifs.
          </li>
          <li>
            Bretelles à deux élastiques aux épaules et à la taille.
          </li>
          <li>
            Noeuds décoratifs et pendentif Lounge en or rose.
          </li>
          <li>
            Fermeture par crochets et œillets.
          </li>
          <li>
            Ensemble soutien-gorge et string assorti.
          </li>
          <li>
            Élément métallique gravé Lounge en or rose.
          </li>
          <li>
            60% polyester, 34% polyester recyclé, 6% élasthanne.
          </li>
        </ul>
        <p>
          C'est le moment de vous épanouir dans notre ensemble Sheer Floral Balcony. Avec sa maille extensible brodée de
          fleurs, ses doubles élastiques, ses délicats nœuds délicats et ses éléments gravées en or rose, préparez-vous
          à
          vous prélasser cet été.
        </p>
      </div>

      <div class="card-footer text-center border-0">
        <a href class="fw-bold text-dark fs-6" @click.prevent="expanded = !expanded">
          <span v-if="expanded">Show less</span>
          <span v-else>Show more</span>
        </a>
      </div>
    </div>

    <div class="card bg-light shadow-none d-none">
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
    // numberOfReviews: {
    //   type: Number,
    //   default: 0
    // },
    // productVariants: {
    //   type: Array,
    //   default: () => []
    // }
  },
  data: () => ({
    expanded: false,
    returnPolicy: 'Les retours gratuits sont disponibles pour ladresse dexpédition que vous avez choisie. Vous pouvez retourner larticle pour nimporte quelle raison dans son état neuf et inutilisé, sans frais de retour.',
    securedTransactionText: 'Nous nous efforçons de protéger votre sécurité et votre vie privée. Notre système de paiement sécurisé chiffre vos données lors de la transmission. Nous ne partageons pas les détails de votre carte de crédit avec les vendeurs tiers, et nous ne vendons pas vos données personnelles à autrui. En savoir plus'
  }),
  computed: {
    ...mapState(useShop, ['userLists']),
    ...mapState(useAuthentication, ['isAuthenticated']),

    hasDescription () {
      return this.product
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

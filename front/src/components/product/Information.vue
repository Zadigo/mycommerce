<template>
  <div class="row">
    <div class="col-12">

      <div id="product-content" class="pr-4 pl-5 pb-5">
        <base-tag v-if="product.on_sale" background-color="error">
          <template>
            {{ $t('Sale') }}
          </template>
        </base-tag>

        <div id="product-info" class="mb-6">
          <p class="font-weight-bold mb-2 font-size-2">{{ product.name|capitalizeLetters }}</p>

          <p class="mb-2 font-size-2">
            <span v-if="product.on_sale" class="mr-1 text-muted">
              <del>{{ $n(product.unit_price, 'currency') }}</del>
            </span>

            <span v-if="product.on_sale">{{ $n(product.sale_price, 'currency', $i18n.locale) }}</span>
            <span v-else class="fw-4 fs-24">{{ $n(product.unit_price, 'currency', $i18n.locale) }}</span>
          </p>

          <!-- TODO: Implementt reviews -->
          <!-- <div class="d-flex justify-content-left">
            <div class="mr-3">
              <font-awesome-icon icon="star" />
              <font-awesome-icon icon="star" />
              <font-awesome-icon icon="star" />
              <font-awesome-icon icon="star" />
            </div>
            <b-link @click="goToReviewsSection">{{ numberOfReviews }} {{ $tc('review', numberOfReviews) }}</b-link>
          </div> -->
        </div>
        
        <!-- TODO: Put triggers for these sections and implement them -->
        <!-- <p id="multiple-payments">
          <font-awesome-icon icon="info-circle" class="mr-1" />
          {{ $t('interest_rate_payments', { value: $n(calculatePaymentFraction(product.unit_price), 'currency') }) }}
        </p>
        
        <p>
          Livré en un jour et <b-link v-b-popover.hover.bottom="returnPolicy" class="font-weight-bold">retour GRATUITS</b-link>
        </p> -->

        <!-- TODO: Delete description -->
        <!-- <div v-if="hasDescription" id="description">
          <p class="lead font-weight-bold">Description</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Et dolor suscipit libero 
            eos atque quia ipsa sint voluptatibus! Beatae sit assumenda asperiores iure at maxime
            atque repellendus maiores quia sapiente.
          </p>
        </div> -->

        <!-- Actions -->
        <actions class="my-7" :product="product" :product-variants="productVariants" :sizes="sizes" />

        <div class="my-4">
          <b-link v-b-popover.click.bottom="securedTransactionText">
            <font-awesome-icon icon="lock" class="mr-2" />
            {{ $t('secured_payments') }}
          </b-link>
        </div>

        <!-- Size Guide -->
        <size-guide />

        <!-- Additional information -->
        <additional-information :product="product" />

        <!-- TODO: Move to actions perhaps ? -->
        <!-- 
        <b-form-checkbox v-model="cartOptions.is_gift">
          Ceci sera un cadeau
        </b-form-checkbox> -->

        <!-- Add to list -->
        <v-menu v-if="isAuthenticated" :close-on-content-click="false" transition="scale-transition">
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
        <b-card class="shadow-none border my-4">
          <b-card-text>
            <b-container>
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
            </b-container>
          </b-card-text>
        </b-card>

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
    
    </div>
  </div>
</template>

<script>
var _ = require('lodash')

import { mapGetters, mapState } from 'vuex'

import Actions from './information/Actions.vue'
import AdditionalInformation from './information/AdditionalInformation.vue'
import SizeGuide from "./information/SizeGuide.vue"

export default {
  name: 'Information',

  components: {
    Actions,
    AdditionalInformation,
    SizeGuide
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
    },

    sizes() {
      // Return all the size options for the given product
      return _.filter(this.product.additional_variants, (variant) => {
        return variant.category === 'Size'
      })
    }
  },
  
  methods: {
    goToReviewsSection () {
      document.getElementById('reviews').scrollIntoView()
    },

    calculatePaymentFraction (unitPrice) {
      var price = unitPrice * 1
      return Math.floor(price / 4 * 1000) / 1000
    },
    
    addToList (wishlist) {
      if (!this.isAuthenticated) {
        this.$store.commit('authenticationModule/loginUser')
      } else {
        this.$api.shop.lists.add(this.product, wishlist)
        .then((response) => {
          // TODO: Capture an action here with analytics
          response
        })
        .catch((error) => {
          error
        })
      }
    },

    getUserLists () {
      this.$api.shop.lists.all()
      .then((response) => {
        this.$store.commit('setUserLists', response.data)
      })
      .catch((error) => {
        error
      })
    }
  }
}
</script>

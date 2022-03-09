<template>
  <section id="product">
    <v-row>
      <v-col cols="12">
        <v-card flat>
          <v-card-actions class="text-right justify-content-right">
            <v-btn @click="$router.go(-1)">
              <v-icon class="mr-2">mdi-arrow-left</v-icon>
              Annuler
            </v-btn>

            <v-btn @click="updateProduct">
              Mettre à jour
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="8">

        <v-card>
          <v-card-title>
            Informations
          </v-card-title>

          <v-card-text class="mb-3">
            <v-text-field type="text" v-model="productUpdates.name" hide-details outlined></v-text-field>
          </v-card-text>
        </v-card>

        <v-card>
          <v-card-title>
            Media
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="3">
                <v-img src="http://via.placeholder.com/300x300"></v-img>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

      </v-col>
      
      <v-col cols="4">
        <v-card>
          <v-card-title>
            Options
          </v-card-title>

          <v-card-text>
            <v-switch v-model="productUpdates.active" label="Activer"></v-switch>  
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>

<script>
// var _ = require('lodash')

import { mapState } from 'vuex'

export default {
  name: 'ProductView',
  
  data: () => ({
    productUpdates: {}
  }),
  
  computed: {
    ...mapState('dashboardModule', ['productDetails'])
  },
  
  beforeMount () {
    this.$store.commit('dashboardModule/setProductDetails', this.$route.params.id)

    // Set the elements that we have in the dict
    // which will be available for when the user
    // updates
    Object.assign(this.productUpdates, this.productDetails)
  },

  methods: {
    updateProduct () {
      this.$api.dashboard.products.update(this.productUpdates)
      .then((response) => {
        this.$store.commit('dashboardModule/updateProduct', response.data)
      })
      .catch((error) => {
        error
      })
    }
  }
}
</script>

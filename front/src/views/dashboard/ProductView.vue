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
        
        <!-- Informations -->
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
            Variants
          </v-card-title>

          <v-card-text>
            <v-autocomplete v-model="productUpdates.color" :items="['Beige', 'Black', 'White']" auto-select-first solo></v-autocomplete>  
          </v-card-text>
        </v-card>

        <!-- Media selection -->
        <v-card>
          <v-toolbar dense>
            <v-toolbar-title>
              
              <v-spacer></v-spacer>
              
              <v-menu :close-on-content-click="true" :open-on-hover="false" :rounded="false" transition="slide-transition">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon>
                    <v-icon>mdi-vertical-dots</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item @click="loadImages">
                    <v-list-item-title>Choisir des images</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar-title>

            <!-- Image selection -->
            <v-dialog v-model="openImageSelection" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
              <v-card>
                <v-toolbar dark color="primary">
                  <v-btn icon dark @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>

                  <v-toolbar-title>Settings</v-toolbar-title>
                  
                  <v-spacer></v-spacer>

                  <v-toolbar-items>
                    <v-btn dark text @click="dialog = false">
                      Save
                    </v-btn>
                  </v-toolbar-items>
                </v-toolbar>
              </v-card>
            </v-dialog>
          </v-toolbar>

          <v-card-title>
            Media
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="3">

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
    productUpdates: {},
    openImageSelection: false
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
    },

    loadImages () {
      this.$api.dashboard.images.all()
      .then((response) => {
        response
        this.openImageSelection = true
      })
      .catch((error) => {
        error
      })
    }
  }
}
</script>

<template>
  <section id="images">

    <v-container>
      <!-- Heading -->
      <v-row>
        <v-col cols="12">
          <page-header :title="$route.meta.text" />
        </v-col>

        <v-col cols="12">
          <v-card>
            <!-- Toolbar -->
            <v-toolbar>
              <v-spacer></v-spacer>
              <v-toolbar-title>
                <v-menu :close-on-content-click="true" :open-on-hover="false" :rounded="false" transition="scale-transition">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" icon v-on="on">
                      <v-icon>mdi-dots-horizontal</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item>
                      <v-list-item-title>
                        Activer
                      </v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-title>
                        Désactiver
                      </v-list-item-title>
                    </v-list-item>
                    
                    <v-list-item @click="renameProductsModal=true">
                      <v-list-item-title>
                        Renommer
                      </v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-title>
                        Supprimer
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>                
              </v-toolbar-title>
            </v-toolbar>

            <!-- Table -->
            <v-card-text>
              <v-data-table v-model="selectedProducts" :headers="headers" :items="products" :items-per-page="300" item-key="id" show-select class="elevation-0">
                <template v-slot:item.name="{ item }">
                  <router-link :to="{ name: 'dashboard_product_view', params: { id: item.id } }">
                    {{ item.name }}
                  </router-link>
                </template>  

                <template v-slot:item.active="{ item }">
                  <v-chip :color="getColor(item.active)" dark>
                    <v-icon v-if="item.active">mdi-check</v-icon>
                    <v-icon v-else>mdi-window-close</v-icon>
                  </v-chip>
                </template>  

                <template v-slot:item.actions="{ item }">
                  {{ item }}
                  <v-icon class="mr-2">mdi-vertical-dots</v-icon>
                </template>
              </v-data-table>          
            </v-card-text>
          </v-card>
        </v-col>

      </v-row>

      <!-- Modal -->
      <v-dialog v-model="renameProductsModal" max-width="500px">
        <v-card>
          <v-card-text>
            <v-text-field v-model="newProductsName" type="text"></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-btn color="blue darken-1" text @click="renameProductsModal = false">Annuler</v-btn>
            <v-btn :disabled="!hasSelection" color="blue darken-1" @click="renameProducts">Renommer {{ selectedProducts.length }} produits</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-container>
  </section>
</template>

<script>
import { mapState } from 'vuex'
var _ = require('lodash')

import PageHeader from '../../components/dashboard/PageHeader.vue'

export default {
  name: 'ProductsView',

  components: {
    PageHeader
  },

  data: () => ({
    // products: [],
    newProductsName: null,
    selectedProducts: [],
    renameProductsModal: false,
    headers: [
      {
        text: 'ID',
        align: 'start',
        sortable: true,
        value: 'id'
      },
      {
        text: 'Nom du produit',
        align: 'start',
        sortable: true,
        value: 'name'
      },
      {
        text: 'Actif',
        align: 'start',
        sortable: true,
        value: 'active'
      }
    ]
  }),
  
  computed: {
    ...mapState('dashboardModule', ['products']),

    hasSelection () {
      return this.selectedProducts.length > 0
    },

    selectedProductsIds () {
      return _.map(this.selectedProducts, (product) => {
        return product.id
      })
    }
  },

  beforeMount() {
    this.getProducts()
  },

  methods: {
    async getProducts() {
      // TODO: Check for when pagination is integrated
      try {
        var response = await this.axios.get('/dashboard/products')
        this.$store.commit('dashboardModule/setProducts', response.data)
      } catch(error) {
        console.log(error)
      }
    },

    async renameProducts() {
      var data = {
        name: this.newProductsName,
        products: this.selectedProducts
      }

      try {
        var response = await this.axios.post('/dashboard/products/rename', data)
        response
        this.renameProductsModal = false
      } catch(error) {
        console.log(error)
      }
    },
    // renameProducts () {
    //   var data = {
    //     name: this.newProductsName,
    //     products: this.selectedProductsIds
    //   }
      
    //   this.$api.dashboard.products.rename(data)
    //   .then((response) => {
    //     response
    //     // this.$store.commit('dashboardModule/setProducts', response.data)
    //     this.renameProductsModal = false
    //   })
    //   .catch((error) => {
    //     error
    //   })
    // },

    getColor (state) {
      if (state) {
        return 'green'
      } else {
        return 'red'
      }
    }
  }
}
</script>

<template>
  <page-content>
    <template>
      <v-card>
        <!-- Toolbar -->
        <v-toolbar>
          <v-text-field v-model="search" type="text" solo></v-text-field>
          
          <v-spacer></v-spacer>

          <v-btn text>
            <v-icon class="mr-2">mdi-plus</v-icon>
            Create
          </v-btn>

          <v-btn text>
            <v-icon class="mr-2">mdi-content-copy</v-icon>
            Duplicate
          </v-btn>
          
          <v-toolbar-title>
            <v-menu :close-on-content-click="true" :open-on-hover="false" :rounded="false" transition="scale-transition">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-check-circle</v-icon>
                  </v-list-item-icon>

                  <v-list-item-title>
                    Activate
                  </v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-check-circle-outline</v-icon>
                  </v-list-item-icon>

                  <v-list-item-title>
                    Deactivate
                  </v-list-item-title>
                </v-list-item>
                                    
                <v-list-item @click="renameProductsModal=true">
                  <v-list-item-icon>
                    <v-icon>mdi-pen</v-icon>
                  </v-list-item-icon>

                  <v-list-item-title>
                    Rename
                  </v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-delete</v-icon>
                  </v-list-item-icon>

                  <v-list-item-title>
                    Delete
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>                
          </v-toolbar-title>
        </v-toolbar>

        <!-- Table -->
        <v-card-text>
          <v-data-table v-model="selectedProducts" :headers="headers" :items="searchedProducts" :items-per-page="300" item-key="id" show-select class="elevation-0">
            <template v-slot:item.name="{ item }">
              <router-link :to="{ name: 'dashboard_product_view', params: { id: item.id } }">
                {{ item.name }}
              </router-link>
            </template>  

            <template v-slot:item.active="{ item }">
              <v-icon v-if="item.active" color="success">mdi-check-circle</v-icon>
              <v-icon v-else color="warning">mdi-check-circle-outline</v-icon>
            </template>  

            <template v-slot:item.actions="{ item }">
              {{ item }}
              <v-icon class="mr-2">mdi-vertical-dots</v-icon>
            </template>
          </v-data-table>          
        </v-card-text>
      </v-card>

      <!-- Modals -->
      <v-dialog v-model="renameProductsModal" max-width="500px">
        <v-card>
          <v-card-text>
            <div class="container">
              <div class="row">
                <div class="col-12">
                  <v-text-field v-model="newProductsName" type="text" placeholder="New name" solo hide-details></v-text-field>
                </div>
              </div>
            </div>
          </v-card-text>

          <v-card-actions class="d-flex justify-content-right">
            <v-btn text @click="renameProductsModal = false">
              Cancel
            </v-btn>

            <v-btn :disabled="!hasSelection" color="blue darken-1" @click="renameProducts">
              Rename {{ selectedProducts.length }} products
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </page-content>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import { searchHelper } from '@/utils'

import PageContent from '@/layouts/dashboard/PageContent.vue'

export default {
  name: 'ProductsView',

  components: {
    PageContent
  },

  data: () => ({
    // products: [],
    search: null,
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

    searchedProducts() {
      return searchHelper(this.search, this.products, ['name'])
    },

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

<template>
  <section id="product">
    <v-row>
      <v-col cols="12">
        <v-card flat>
          <v-card-actions class="text-right justify-content-right">
            <v-btn @click="$router.go(-1)">
              <v-icon class="mr-2">mdi-arrow-left</v-icon>
              Cancel
            </v-btn>

            <v-btn @click="updateProduct">
              Update
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
            <v-text-field type="text" v-model="productUpdates.name" placeholder="Product name" class="mb-3" hide-details outlined></v-text-field>
            <v-autocomplete :items="categories" :loading="categoriesLoading" :search-input.sync="searchedCategory" cache-items placeholder="Category" hide-details outlined>
              <v-text-field type="text"></v-text-field>
            </v-autocomplete>
          </v-card-text>
        </v-card>

        <!-- Prices -->
        <v-card class="mb-2">
          <v-card-title>
            Prices
          </v-card-title>

          <v-card-text>
            <v-text-field type="number" v-model="productUpdates.unit_price" placeholder="Price" hide-details outlined></v-text-field>

            <v-checkbox v-model="productUpdates.on_sale" label="Mark the product as being on sale"></v-checkbox>

            <v-row v-if="productUpdates.on_sale">
              <v-col cols="6">
                <v-text-field type="number" v-model="productUpdates.sale_value" class="mb-3" placeholder="Sale value" hide-details outlined></v-text-field>
                <v-text-field type="number" v-model="productUpdates.sale_price" placeholder="Sale price" hide-details outlined></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Variants -->
        <v-card class="mb-2">
          <v-card-title>
            Variants
          </v-card-title>

          <v-card-text>
            <v-autocomplete v-model="productUpdates.color" :items="['Beige', 'Black', 'White', 'Charcoal']" placeholder="Color" outlined auto-select-first hide-details></v-autocomplete>  
          </v-card-text>
        </v-card>

        <!-- Media selection -->
        <v-card>
          <v-toolbar dense flat>
            <v-toolbar-title>
              Media
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu :close-on-content-click="true" :open-on-hover="false" :rounded="false" transition="slide-transition">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item @click="loadImages">
                  <v-list-item-title>Choisir des images</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

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

          <v-card-text>
            <v-row>
              <v-col v-for="image in additionalProductDetails.images" :key="image.id" cols="3">
                <div id="product-image">
                  <v-img :src="image.mid_size|mediaUrl"></v-img>

                  <v-btn icon @click="removeImage">
                    <v-icon>mdi-window-close</v-icon>
                  </v-btn>
                </div>
              </v-col>

              <v-col cols="3">
                <div class="select-images">
                  <div class="wrapper">
                    <v-icon>mdi-plus</v-icon>
                  </div>
                </div>
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
            <v-switch v-model="productUpdates.active" label="Activer" hide-details></v-switch>  
            <v-switch v-model="productUpdates.display_new" label="Afficher le produit comme nouveau" hide-details></v-switch>  
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>

<script>
var _ = require('lodash')
import { mapState } from 'vuex'

export default {
  name: 'ProductView',
  
  data: () => ({
    productUpdates: {},
    openImageSelection: false,
    additionalProductDetails: {},

    categoriesLoading: false,
    categories: ['Bags'],
    searchedCategory: null,
    selectedCategory: null
  }),
  
  computed: {
    ...mapState('dashboardModule', ['productDetails'])
  },

   watch: {
    searchedCategory(newValue) {
      if (newValue && newValue !== this.selectedCategory) {
        this.queryCategories()
      }
    }
  },
  
  beforeMount () {
    this.$store.commit('dashboardModule/setProductDetails', this.$route.params.id)

    // Set the elements that we have in the dict
    // which will be available for when the user
    // updates
    Object.assign(this.productUpdates, this.productDetails)
    this.getAdditionalDetails()
  },

  methods: {
    async getAdditionalDetails() {
      try {
        var response = await this.axios.get(`shop/dashboard/products/${this.$route.params.id}`)
        var data = response.data
        
        this.additionalProductDetails = data
        
        var updatedFields = {}
        var images = _.map(this.additionalProductDetails.images, (image) => {
          return image.id
        })
        
        updatedFields['images'] = images
        Object.assign(updatedFields, data)
        this.productUpdates = updatedFields
      } catch(error) {
        console.log(error)
      }
    },
    
    async updateProduct() {
      try {
        var response = await this.axios.post(`shop/dashboard/products/${this.$route.params.id}/update`, this.productUpdates)
        response
      } catch(error) {
        console.log(error)
      }
    },
    
    async removeImage() {
      // Do something
    },

    async loadImages () {
      try {
        var response = await this.axios.get('shop/images')
        this.openImageSelection = true
        response
      } catch(error) {
        console.log(error)
      }
    },

    async queryCategories() {
      try {
        this.categoriesLoading = true
        
        var response = await this.axios.get('shop/dashboard/categories')
        this.categories = response.data
        
        this.categoriesLoading = false
      } catch(error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped>
  #product-image {
    cursor: pointer;
  }

  .select-images {
    position: relative;
    cursor: pointer;
    height: 100%;
    /* border: 1px solid #d7d7d7; */
    border-radius: 10px;
    background: rgb(240, 240, 240, .5);
    position: relative;
    overflow: hidden;
  }
  .select-images .wrapper {
    position: absolute;
    background-color: rgba(240, 240, 240, 1);
    border-radius: 50%;
    padding: 1.5rem;
  }
</style>

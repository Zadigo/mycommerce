<template>
  <section id="product">
    <v-row>
      <!-- Top header -->
      <v-col cols="12">
        <v-card flat>
          <v-card-actions class="text-right justify-content-right">
            <v-btn color="danger" text @click="$router.go(-1)">
              <v-icon class="mr-2">mdi-cancel</v-icon>
              Cancel
            </v-btn>

            <v-btn text>
              <v-icon class="mr-2">mdi-arrow-left</v-icon>
              Previous
            </v-btn>

            <v-btn text>
              Next
              <v-icon class="ml-2">mdi-arrow-right</v-icon>
            </v-btn>
            
            <v-btn color="primary" @click="updateProduct">
              <v-icon class="mr-2">mdi-save</v-icon>
              Save and update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card>
          <v-card-title>
            {{ productDetails.name }}
          </v-card-title>
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
                <v-list-item @click="loadImages(() => { openImageSelection = true })">
                  <v-list-item-title>Choisir des images</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>

          <v-card-text>
            <v-row>
              <v-col v-for="image in additionalProductDetails.images" :key="image.id" cols="3">
                <div id="product-image">
                  <v-img :src="image.mid_size|mediaUrl"></v-img>

                  <v-btn icon @click="removeImage(image)">
                    <v-icon>mdi-window-close</v-icon>
                  </v-btn>
                </div>
              </v-col>

              <v-col cols="3">
                <div class="select-images" @click="selectProductImages=true">
                  <div class="wrapper">
                    <v-icon>mdi-plus</v-icon>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      
      <!-- Aside -->
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

    <!-- Image selection -->
    <v-dialog v-model="openImageSelection" width="900px" persistent>
      <v-card style="position:relative;">
        <v-card-text>
          <v-container>
            <v-row v-if="images.length > 0">
              <v-col v-for="image in images" :key="image.id" :name="image.name" cols="3" @click="selectImage(image)">
                <v-img :src="image.mid_size|mediaUrl" :class="{ 'shadow': selectedImages.includes(image.id) }"></v-img>
              </v-col>

              <v-col cols="12" class="d-flex justify-content-center">
                <v-btn :disabled="!cachedResponse.previous" class="mx-1" @click="loadPrevious">Previous</v-btn>
                <v-btn class="mx-1" @click="loadNext">Next</v-btn>
              </v-col>

              <div class="actions">
                <v-btn @click="openImageSelection=false" text>Close</v-btn>
                <v-btn @click="selectedImages=[]" text>Deselect all</v-btn>
                <v-btn :disabled="!selectedImages.length > 0" @click="associateImagesToProduct(() => { openImageSelection = false })" color="primary">Add {{ selectedImages.length }} images</v-btn>
              </div>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import _ from 'lodash'
// import { listManager } from '@/utils'
import { mapState } from 'vuex'
import imagesMixin from '@/mixins/dashboard/images'
import itemNavigation from '@/mixins/dashboard/item_navigation'

export default {
  name: 'ProductView',

  mixins: [imagesMixin, itemNavigation],
  
  data: () => ({
    productUpdates: {},
    openImageSelection: false,
    additionalProductDetails: {},

    categoriesLoading: false,
    categories: [],
    searchedCategory: null,
    selectedCategory: null,

    selectedImages: []
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
    
    async removeImage(image) {
      try {
        var data = this.newAssociation
        
        data['images'] = [image.id]

        if (!data['product']) {
            data['product'] = this.$route.params.id
        }

        var response = await this.axios.post(`shop/dashboard/products/${this.$route.params.id}/images/dissociate`, data)
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
    },

    // selectImage(image) {
    //   this.selectedImages = listManager(this.selectedImages, image.id)
    // }
  }
}
</script>

<style scoped>
  #product-image {
    cursor: pointer;
  }
/* 
  .select-images {
    position: relative;
    cursor: pointer;
    height: 100%;
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
  } */

  .actions {
    position:sticky;
    display: flex;
    justify-content: center;
    bottom:3%;
    /* left: calc(100% - 600px); */
    margin: 0 auto;
    height:auto;
    min-width: 600px;
    width: 600px;
    background-color:white;
    border-radius:.25em;
    align-items:center;
    box-shadow:0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
    padding: 8px 16px;
  }
  .actions > .v-btn {
    padding: 0 8px;
  }
  .actions > .v-btn + .v-btn {
    margin-left: 8px;
  }
</style>

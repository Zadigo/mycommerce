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
            <v-card-text>
              <v-autocomplete v-model="search" :items="imageNames" multiple chips solo></v-autocomplete>
            </v-card-text>
            
            <v-card-actions>
              <v-dialog v-model="showUploadImagesDialog" width="800">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" class="mr-2" text v-on="on">
                    <v-icon class="mr-2">mdi-upload</v-icon>
                    Upload images
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title>
                    Upload new images
                  </v-card-title>

                  <v-card-text>
                    <v-file-input label="File input" prepend-icon="mdi-camera" multiple outlined></v-file-input>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-btn text>Upload</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-btn class="mr-2" text>Sélectionner tout</v-btn>
              <v-btn text @click="selectedImages=[]">Déselectionner <v-chip class="ml-2" color="primary" label>{{ selectedImages.length }}</v-chip> </v-btn>

              <v-btn color="indigo" dark @click="loadGenericProducts">
                Associer au produit
              </v-btn>

              
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Images -->
      <v-row>
        <!-- <transition-group class="row" name="general-transition" tag="div"> -->
        <v-col v-for="image in searchedImages" :key="image.id" cols="4">  
          <image-container :key="image.id" :image="image" :is-loading="isLoading" :selected-images="selectedImages" @image-selected="setSelection" />
        </v-col>
        <!-- </transition-group> -->
      </v-row> 

      <!-- Pagination -->
      <v-row>
        <v-col cols="12">
          <v-btn :class="{ disabled: !hasPrevious }" @click="loadPrevious">
            <v-icon class="mr-2">mdi-arrow-left</v-icon>
            Précédent
          </v-btn>

          <v-btn :class="{ disabled: !hasNext }" @click="loadNext">
            <v-icon class="mr-2">mdi-arrow-right</v-icon>
            Suivant
          </v-btn>
        </v-col>
      </v-row>

      <v-btn elevation="2" absolute bottom right fab></v-btn>
    </v-container>    

    <!-- Modals -->
    <v-dialog v-model="productSelectionModal" height="200" width="500">
      <!-- <template v-slot:activator="{ on, attrs }">
      </template> -->

      <v-card>
        <v-card-text>
          <b-list-group>

            <b-list-group-item v-for="product in products" :key="product.id" action @click="newAssociation.product = product.id">
              {{ product.name }}
            </b-list-group-item>
          
          </b-list-group>                    
        </v-card-text>

        <v-card-actions>
          <v-btn text @click="associateImages">
            Associer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
var _ = require('lodash')

import ImageContainer from '../../components/dashboard/product_images/ImageContainer.vue'
import PageHeader from '../../components/dashboard/PageHeader.vue'

export default {
  name: 'ProductImagesView',
  components: {
    ImageContainer,
    PageHeader
  },

  data: () => ({
    cachedResponse: {},
    products: [],

    isLoading: true,

    search: [],

    selectedImages: [],
    associationMenu: false,
    newAssociation: {
      product: null
    },

    productSelectionModal: false,
    showUploadImagesDialog: false
  }),

  computed: {
    images () {
      try {
        return this.cachedResponse.results
      } catch {
        return []
      }
    },

    searchedImages () {
      if (this.search.length > 0) {

        return _.filter(this.images, (image) => {
          return this.search.includes(image.name)
        })
      
      } else {
      
        return this.images
      
      }
    },

    imageNames () {
      return _.map(this.images, (image) => {
        return image.name
      })
    },

    hasNext () {
      return this.cachedResponse.next ? true : false
    },

    hasPrevious () {
      return this.cachedResponse.previous ? true : false
    }
  },

  beforeMount () {
    if (this.$session.contains('images')) {

      this.cachedResponse = this.$session.retrieve('images')
      setTimeout(() => {
        this.isLoading = false
      }, 500);
    
    } else {
    
      this.loadImages()
    
    }
  },

  methods: {
    async loadImages (url) {
      function buildUrl(url) {
        var limit = 100
        var offset = 0
        
        if (url) {
            var instance = new URL(url)
            var potentialLimit = instance.searchParams.get('limit')
            var potentialOffset = instance.searchParams.get('offset')

            limit = potentialLimit ? potentialLimit : 100
            offset = potentialOffset ? potentialOffset : 0
        }

        var path = new URLSearchParams({ limit: limit, offset: offset })
        return path
      }

      try {
        var response = await this.$axios.get(`/images?${ buildUrl(url).toString() }`)
        var cachedResponse = response.data

        this.cachedResponse = cachedResponse
        this.$session.create('images', cachedResponse)
        this.isLoading = false
        this.scrollToTop()
      } catch(error) {
        console.log(error)
      }
    },

    associateImages () {
      this.associationMenu = false

      // TODO: Simplify this section by unifying
      // the elements to send in just one array
      var data = this.newAssociation
      data['images'] = this.selectedImages

      this.$api.dashboard.products.associateImages(data)
      .then((response) => {
        // TODO: Show alert that images were
        // correctly associated
        response
        this.productSelectionModal = false
        this.selectedImages = []
      })
      .catch((error) => {
        console.log(error)
      })
    },

    loadPrevious () {
      this.loadImages(this.cachedResponse.previous)
    },

    loadNext () {
      this.loadImages(this.cachedResponse.next)
    },
   
    loadGenericProducts () {
      this.$api.dashboard.products.generic()
      .then((response) => {
        this.productSelectionModal = true
        this.products = response.data
      })
      .catch((error) => {
        error
      })
    },

    setSelection (imageId) {
      // TODO: Create a mixin that manages the state of
      // of objects in arrays
      if (this.selectedImages.includes(imageId)) {
        var index = _.indexOf(this.selectedImages, imageId)
        this.selectedImages = this.selectedImages.splice(0, index)
      } else {
        this.selectedImages.push(imageId)
      }
    }
  }
}
</script>

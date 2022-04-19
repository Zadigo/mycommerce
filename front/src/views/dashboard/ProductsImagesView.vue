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
              <!-- Modal -->
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
                    <v-btn text>
                      Upload
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-btn class="mr-2" text>
                Select all
              </v-btn>

              <v-btn text @click="selectedImages=[]">
                Unselect all 
                <v-chip class="ml-2" color="primary" label>{{ selectedImages.length }}</v-chip> 
              </v-btn>

              <v-btn color="indigo" dark @click="loadGenericProducts">
                Associate to product
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
            Previous
          </v-btn>

          <v-btn :class="{ disabled: !hasNext }" @click="loadNext">
            <v-icon class="mr-2">mdi-arrow-right</v-icon>
            Next
          </v-btn>
        </v-col>
      </v-row>

      <v-btn elevation="2" absolute bottom right fab></v-btn>
    </v-container>    

    <!-- Product selection -->
    <v-dialog v-model="productSelectionModal" width="800">
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <div class="list-group list-group-flush">
                  <a v-for="product in products" :key="product.id" :class="{ active: product.id === newAssociation.product }" class="list-group-item list-group-item-action" @click="newAssociation.product = product.id">
                    <div class="ms-2 me-auto">
                      <div class="fw-bold">{{ product.id }}. {{ product.name }}</div>
                      Cras justo odio
                    </div>
                  </a>
                </div>
              </v-col>

              <v-col cols="12">
                <v-switch v-model="newAssociation.replace_existing_images" label="Replace product's existing images"></v-switch>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-btn text @click="productSelectionModal=false">
            Cancel
          </v-btn>

          <v-btn color="primary" @click="associateImagesToProduct">
            Associate
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import _ from 'lodash'
import { buildLimitOffset, listManager } from '@/utils'

import ImageContainer from '@/components/dashboard/product_images/ImageContainer.vue'
import PageHeader from '@/components/dashboard/PageHeader.vue'

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

    newAssociation: {
      product: null,
      replace_existing_images: false
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
    async loadImages(url) {
      try {
        var response = await this.axios.get(`/images?${buildLimitOffset(url).toString()}`)
        var cachedResponse = response.data

        this.cachedResponse = cachedResponse
        this.$session.create('images', cachedResponse)
        this.isLoading = false
        this.scrollToTop()
      } catch(error) {
        console.log(error)
      }
    },

    async loadGenericProducts() {
      try {
        var response = await this.axios.get('shop/dashboard/products/generic')

        this.products = response.data
        this.productSelectionModal = true
      } catch(error) {
        console.log(error)
      }
    },

    async associateImagesToProduct() {
      try {
        var data = this.newAssociation
        
        data['images'] = this.selectedImages

        var response = this.axios.post(`shop/dashboard/products/${data.product}/images/associate`, data)
        this.selectedImages = []
        this.productSelectionModal = false
        response
      } catch(error) {
        console.log(error)
      }
    },

    loadPrevious() {
      this.loadImages(this.cachedResponse.previous)
    },

    loadNext() {
      this.loadImages(this.cachedResponse.next)
    },

    setSelection(imageId) {
      this.selectedImages = listManager(this.selectedImages, imageId)
    }
  }
}
</script>

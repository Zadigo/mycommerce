<template>
  <page-content>
    <template #heading>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-autocomplete v-model="search" :items="imageNames" multiple chips outlined hide-details></v-autocomplete>
          </v-card-text>

          <v-card-actions>
            <v-btn class="mr-2" text @click="showUploadImagesDialog=!showUploadImagesDialog">
              <v-icon class="mr-2">mdi-upload</v-icon>
              Upload images
            </v-btn>

            <v-btn class="mr-2" text @click="selectAll">
              <v-icon class="mr-2">mdi-selection-multiple</v-icon>
              Select all
            </v-btn>

            <v-btn :disabled="!hasSelection" text @click="selectedImages=[]">
              Unselect 
              <v-chip class="ml-2" color="primary" chip>{{ selectedImages.length }}</v-chip> 
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn color="primary" dark @click="productSelectionModal = true">
              <v-icon class="mr-2">mdi-view-list</v-icon>
              Associate to product
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </template>

    <template>
      <!-- Images -->
      <v-row>
        <v-col v-for="image in searchedImages" :key="image.id" cols="4">  
          <image-container :key="image.id" :image="image" :is-loading="isLoading" :selected-images="selectedImages" @image-selected="setSelection" />
        </v-col>
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

      <!-- Modals -->
      <v-dialog v-model="productSelectionModal" width="800">
        <v-card>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <div class="list-group list-group-flush">
                    <a v-for="product in genericProducts" :key="product.id" :class="{ active: product.id === newAssociation.product }" class="list-group-item list-group-item-action" @click="newAssociation.product = product.id">
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

            <v-btn :disabled="!hasSelection" color="primary" @click="associateImagesToProduct">
              Associate {{ selectedImages.length }} images
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showUploadImagesDialog" width="800">
        <v-card>
          <v-card-text class="py-5">
            <v-file-input label="File input" prepend-icon="mdi-camera" multiple outlined hide-details></v-file-input>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn text>
              Upload
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </page-content>
</template>

<script>
import _ from 'lodash'
import { buildLimitOffset, listManager } from '@/utils'

import ImageContainer from '@/components/dashboard/product_images/ImageContainer.vue'
import PageContent from '@/layouts/dashboard/PageContent.vue'
import { mapState } from 'vuex'

export default {
  name: 'ProductImagesView',
  components: {
    ImageContainer,
    PageContent
  },

  data: () => ({
    cachedResponse: {},

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
    ...mapState('dashboardModule', ['products']),

    genericProducts() {
      return _.map(this.products, (product) => {
        return { id: product.id, name: product.name, color: product.color }
      })
    },

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

    hasSelection() {
      return this.selectedImages.length > 0
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
        var response = await this.axios.get(`shop/dashboard/images?${buildLimitOffset(url).toString()}`)
        var cachedResponse = response.data

        this.cachedResponse = cachedResponse
        this.$session.create('images', cachedResponse)
        this.isLoading = false
        this.scrollToTop()
      } catch(error) {
        console.log(error)
      }
    },

    // async loadGenericProducts() {
    //   // try {
    //   //   var response = await this.axios.get('shop/dashboard/products/generic')

    //   //   this.products = response.data
    //   //   this.productSelectionModal = true
    //   // } catch(error) {
    //   //   console.log(error)
    //   // }

    // },

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
    },

    selectAll() {
      this.selectedImages = _.map(this.images, (image) => {
        return image.id
      })
    }
  }
}
</script>

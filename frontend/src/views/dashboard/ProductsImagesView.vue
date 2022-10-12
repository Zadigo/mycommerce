<template>
  <section id="images">
    <div class="row">
      <div class="col-12">
        <base-card id="filters">
          <template #footer>
            <button type="button" class="btn btn-primary me-2" @click="showUploadImagesDialog=!showUploadImagesDialog">
              <!-- <v-icon class="mr-2">mdi-upload</v-icon> -->
              Upload images
            </button>
            
            <button type="button" class="btn btn-primary me-2" @click="selectAll">
              <!-- <v-icon class="mr-2">mdi-selection-multiple</v-icon> -->
              Select all
            </button>
            
            <button type="button" class="btn btn-primary me-2" :disabled="!hasSelection" @click="selectedImages=[]">
              Unselect
              <!-- <v-chip class="ml-2" color="primary" chip>{{ selectedImages.length }}</v-chip> -->
            </button>
                        
            <button type="button" class="btn btn-primary me-2" @click="productSelectionModal = true">
              <!-- <v-icon class="mr-2">mdi-view-list</v-icon> -->
              Associate to product
            </button>
          </template>
        </base-card>
      </div>
      
      <div class="row my-3">
        <div v-for="image in searchedImages" :key="image.id" class="col-3">
          <image-container :image="image" />
        </div>
      </div>

      <!-- Pagination -->
      <div class="row my-3">
        <div class="col-12">
          <button type="button" :class="{ disabled: !hasPrevious }" class="btn btn-primary" @click="loadPrevious">
            <font-awesome-icon icon="fa-solid fa-arrow-left" />
            Previous
          </button>
          
          <button type="button" :class="{ disabled: !hasNext }" class="btn btn-primary" @click="loadNext">
            <font-awesome-icon icon="fa-solid fa-arrow-right" />
            Next
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import _ from 'lodash'
import { ref } from 'vue'
import { useUrls, scrollToTop } from '@/composables/utils'

import BaseCard from '@/layouts/bootstrap/cards/BaseCard.vue'
import ImageContainer from '@/components/dashboard/image/ImageContainer.vue'

export default {
  name: 'ProductImagesView',
  components: {
    BaseCard,
    ImageContainer
  },
  setup () {
    const cachedResponse = ref({})
    const images = ref([])
    const { buildLimitOffset } = useUrls()
    return {
      scrollToTop,
      images,
      cachedResponse,
      buildLimitOffset
    }
  },
  data () {
    return {
      selectedImages: [],
      search: null
    }
  },
  computed: {
    searchedImages () {
      if (this.search) {
        return _.filter(this.images, (image) => {
          return this.search.includes(image.name)
        })
      } else {
        return this.images
      }
    },
    hasSelection () {
      return this.selectedImages.length > 0
    },
    hasNext () {
      return this.cachedResponse.next !== null
    },
    hasPrevious () {
      return this.cachedResponse.previous !== null
    }
  },
  beforeMount () {
    if (this.sessionStorage.images) {
      this.cachedResponse = this.sessionStorage.images
      this.images = this.cachedResponse.results
    } else {
      this.loadImages()
    }
  },
  methods: {
    async loadImages (url) {
      try {
        const response = await this.$http.get(`shop/dashboard/images?${this.buildLimitOffset(url)}`)
        const cachedResponse = response.data
        
        this.cachedResponse = cachedResponse
        this.images = this.cachedResponse.results
        this.$session.create('images', cachedResponse)
        // this.isLoading = false
        this.scrollToTop()
      } catch (error) {
        console.log(error)
      }
    },
    loadPrevious () {
      this.loadImages(this.cachedResponse.previous)
    },
    loadNext () {
      this.loadImages(this.cachedResponse.next)
    },
  }
}
</script>

<template>
  <section id="image">
    <div class="row">
      <div class="col-12">
        <base-card>
          <template #body>
            <div class="btn-group">
              <button type="button" class="btn btn-primary" @click="$router.go(-1)">Back</button>
              <button type="button" class="btn btn-primary" @click="previousImage">Previous</button>
              <button type="button" class="btn btn-primary" @click="nextImage">Next</button>
            </div>
          </template>
        </base-card>
      </div>

      <div class="col-12 my-3">
        <base-card>
          <template #body>
            <h4>
              {{ currentlyViewedImage.name }}
            </h4>
          </template>
        </base-card>
      </div>
      
      <div class="col-8">
        <img :src="mediaUrl(currentlyViewedImage.mid_size)" class="img-fluid rounded-1" alt="">
      </div>


      <div class="col-4">
        <base-card>
          <template #body>
            <base-input id="product-name" :initial="currentlyViewedImage.name" />
          </template>

          <template #footer>
            <button type="button" class="btn btn-danger">Delete</button>
            <button type="button" class="btn btn-primary">Save</button>
          </template>
        </base-card>
      </div>
    </div>
  </section>
</template>

<script>
import _ from 'lodash'
import { useUrls } from '@/composables/utils'
import { navigationComposable } from '@/composables/shop'

import BaseCard from '@/layouts/bootstrap/cards/BaseCard.vue'
import BaseInput from '@/layouts/bootstrap/BaseInput.vue'

export default {
  name: 'ProductImageView',
  components: {
    BaseCard,
    BaseInput
  },
  setup () {
    const { mediaUrl } = useUrls()
    const { items, nextItem, previousItem } = navigationComposable()
    return {
      items,
      nextItem,
      previousItem,
      mediaUrl
    }
  },
  data () {
    return {
      cachedResponse: [],
      images: [],
      currentlyViewedImage: {}
    }
  },
  watch: {
    '$route.params.id' (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.setCurrentlyViewedImage()
      }
    }
  },
  beforeMount () {
    this.cachedResponse = this.sessionStorage.images
    this.images = this.cachedResponse.results
    this.items = this.images
    this.setCurrentlyViewedImage()
  },
  methods: {
    setCurrentlyViewedImage () {
      this.currentlyViewedImage = _.find(this.images, ['id', this.$route.params.id * 1])
    },
    previousImage () {
      this.nextItem(this.$route.params.id, (item) => {
        this.$router.push({ name: 'dashboard_image_view', params: { id: item.id } })
      })
    },
    nextImage () {
      this.previousItem(this.$route.params.id, (item) => {
        console.log(item)
        this.$router.push({ name: 'dashboard_image_view', params: { id: item.id } })
      })
    }
  }
}
</script>

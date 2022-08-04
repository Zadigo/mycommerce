<template>
  <div id="images" class="row">
    <div class="col-6 p-1">
      <img :src="getImageForIndex(0)" class="img-fluid" @click="selectedImage = selectImageWithIndex(0)" />
    </div>

    <div class="col-6 p-1">
      <img :src="getImageForIndex(1)" class="img-fluid" @click="selectedImage = selectImageWithIndex(1)" />
    </div>

    <div class="col-8 p-1">
      <div v-if="hasVideo" class="video-wrapper">
        <video :poster="getImageForIndex(1)" playsinline autoplay controls loop>
          <source :src="mediaUrl(productVideo.content)" type="video/mp4" muted>
        </video>
      </div>

      <img :src="getImageForIndex(2)" class="img-fluid" @click="selectedImage = selectImageWithIndex(2)" />
    </div>

    <div class="col-4 p-1">
      <div v-if="hasVideo" class="col-12 pt-0 p-1">
        <img :src="getImageForIndex(2)" class="img-fluid" @click="selectedImage = selectImageWithIndex(2)" />
      </div>

      <div :class="{ 'pt-0': !hasVideo }" class="col-12 p-1">
        <img :src="getImageForIndex(3)" class="img-fluid" @click="selectedImage = selectImageWithIndex(3)" />
      </div>
    </div>
  </div>
</template>

<script>
import { mediaUrl } from '@/utils'
import { getCurrentInstance } from 'vue'
import useTileComposable from '../../../../../composables/tiles'

export default {
  // Component for showing images of a product
  // that contains more than 3 images
  name: 'MultipleImages',
  props: {
    // images: {
    //   type: Array,
    //   required: true
    // },
    productVideo: {
      type: Object,
      default: () => {}
    }
  },
  setup () {
    const app = getCurrentInstance()
    const { hasVideo, getImageForIndex, selectImageWithIndex, selectedImage } = useTileComposable(app)
    return {
      selectedImage,
      getImageForIndex,
      selectImageWithIndex,
      hasVideo,
      mediaUrl
    }
  }
}
</script>

<style scoped>
.video-wrapper {
  display: inline-block;
  vertical-align: baseline;
  overflow: hidden;
}
video {
  width: 100%;
  object-fit: cover;
}
</style>

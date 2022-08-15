<doc>
  Allows the user to switch between the image tiles and a
  specific image detail
</doc>

<template>
  <!-- Image details -->
  <div v-if="selectedImage" class="zoom-container">
    <inner-image-zoom :src="selectedImage" :zoom-src="selectedImage" :zoom-scale="3" zoom-type="hover"></inner-image-zoom>
  </div>
  <!-- <selected-image v-if="selectedImage" :is-new="isNew" :selected-image="selectedImage" @reset-selected-image="selectedImage = undefined" /> -->

  <!-- Images -->
  <div v-else id="tiles">
    <component :is="componentToDisplay" :images="images" :product-video="productVideo" @select-image="selectImage" />
  </div>
</template>

<script>
import MultipleImages from './tiles/MultipleImages.vue'
// import SelectedImage from './tiles/SelectedImage.vue'
import ThreeImages from './tiles/ThreeImages.vue'
import TwoImages from './tiles/TwoImages.vue'
import InnerImageZoom from 'vue-inner-image-zoom'

export default {
  name: 'TileDisplay',
  components: {
    MultipleImages,
    InnerImageZoom,
    // SelectedImage,
    ThreeImages,
    TwoImages
  },
  props: {
    // isNew: {
    //   type: Boolean
    // },
    images: {
      type: Array,
      required: true
    },
    productVideo: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    selectedImage: null,
    playVideo: false
  }),
  computed: {
    numberOfImages () {
      return this.images.length
    },
    componentToDisplay () {
      if (this.numberOfImages === 2) {
        return 'two-images'
      } else if (this.numberOfImages === 3) {
        return 'three-images'
      } else if (this.numberOfImages > 3) {
        return 'multiple-images'
      } else {
        return 'multiple-images'
      }
    }
  },
  watch: {
    '$route.params.id' (current, previous) {
      if (current !== previous) {
        this.selectedImage = null
      }
    }
  },
  methods: {
    selectImage (url) {
      this.selectedImage = url
    }
  }
}
</script>

<style scoped>
.video-action {
  position: relative;
}

.video-action i {
  position: absolute;
  top: 50%;
  bottom: 50%;
  left: 50%;
  right: 50%;
  cursor: pointer;
  font-size: 2rem;
  color: black;
}

.v-image {
  cursor: pointer;
}

.tiles img {
  cursor: zoom-in;
}
</style>

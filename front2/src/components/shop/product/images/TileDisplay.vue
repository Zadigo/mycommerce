<template>
  <selected-image v-if="selectedImage" :is-new="isNew" :selected-image="selectedImage" @reset-selected-image="selectedImage = undefined" />

  <div v-else id="tiles">
    <component :is="componentToDisplay" :images="images" :product-video="productVideo" @select-image="selectImage" />
  </div>
</template>

<script>
import MultipleImages from './tiles/MultipleImages.vue'
import SelectedImage from './tiles/SelectedImage.vue'
import ThreeImages from './tiles/ThreeImages.vue'
import TwoImages from './tiles/TwoImages.vue'

export default {
  name: 'TileDisplay',
  components: {
    MultipleImages,
    SelectedImage,
    ThreeImages,
    TwoImages
  },
  props: {
    isNew: {
      type: Boolean
    },
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

.tiles {
  cursor: pointer;
}

/* .zoom-transition-enter-active
.zoom-transition-leave-active {
  transition: all .3s ease-in-out;
}

.zoom-transition-enter
.zoom-transition-leave-to {
  transform: scale(1.2, 1.2) translateX(-10px);
}

.zoom-transition-leave
.zoom-transition-enter-to {
  transform: scale(1, 1) translateX(0px);
} */
</style>

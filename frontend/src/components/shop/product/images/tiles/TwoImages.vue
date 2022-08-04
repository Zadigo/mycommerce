<template>
  <div id="images" class="row">
    <div class="col-6 p-1">
      <img :src="getImageForIndex(0)" class="img-fluid" @click="selectedImage = selectImageWithIndex(0)" />
    </div>

    <div class="col-6 p-1">
      <img :src="getImageForIndex(1)" class="img-fluid" @click="selectedImage = selectImageWithIndex(1)" />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue'
import useTileComposable from '../../../../../composables/tiles'

export default {
  // Component for showing images of a product
  // that contains more than 2 images
  name: 'TwoImages',
  // props: {
  //   images: {
  //     type: Array,
  //     required: true
  //   },
  //   productVideo: {
  //     type: Object,
  //     default: () => {}
  //   }
  // },
  setup () {
    const app = getCurrentInstance()
    const { selectedImage, getImageForIndex } = useTileComposable(app)
    return {
      selectedImage,
      getImageForIndex
    }
  }
}
</script>

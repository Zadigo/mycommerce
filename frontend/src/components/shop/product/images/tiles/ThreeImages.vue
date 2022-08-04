<template>
  <div id="images" class="row">
    <div class="col-6 p-1">
      <img :src="getImageForIndex(0)" class="img-fluid" @click="selectedImage = selectImageWithIndex(0)" />
    </div>

    <div class="col-6 p-1">
      <img :src="getImageForIndex(1)" class="img-fluid" @click="selectedImage = selectImageWithIndex(1)" />
    </div>

    <div class="col-12 p-1">
      <img :src="getImageForIndex(2)" class="img-fluid" @click="selectedImage = selectImageWithIndex(2)" />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue'
import useTileComposable from '../../../../../composables/tiles'

export default {
  // Component for showing images of a product
  // that contains more than 3 images
  name: 'ThreeImages',
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
    const { getImageForIndex, selectedImage } = useTileComposable(app)
    return {
      getImageForIndex,
      selectedImage
    }
  }
}
</script>

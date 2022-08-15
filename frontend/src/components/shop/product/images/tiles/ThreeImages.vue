<doc>
  Component for showing images of a product that contains
  more exactly three images
</doc>


<template>
  <div id="images" class="row">
    <div class="col-6 p-1">
      <img :src="getImageForIndex(images, 0)" class="img-fluid" @click="selectImageWithIndex(images, 0)" />
    </div>

    <div class="col-6 p-1">
      <img :src="getImageForIndex(images, 1)" class="img-fluid" @click="selectImageWithIndex(images, 1)" />
    </div>

    <div class="col-12 p-1">
      <img :src="getImageForIndex(images, 2)" class="img-fluid" @click="selectImageWithIndex(images, 2)" />
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
  props: {
    images: {
      type: Array,
      required: true
    }
  },
  //   productVideo: {
  //     type: Object,
  //     default: () => {}
  //   }
  // },
  setup () {
    const app = getCurrentInstance()
    const { getImageForIndex, selectImageWithIndex } = useTileComposable(app)
    return {
      getImageForIndex,
      selectImageWithIndex
    }
  }
}
</script>

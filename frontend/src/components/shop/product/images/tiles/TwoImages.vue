<doc>
  Component for showing images of a product that contains
  more exactly two images
</doc>

<template>
  <div id="images" class="row">
    <div class="col-6 p-1">
      <img :src="getImageForIndex(images, 0)" class="img-fluid" @click="selectImageWithIndex(images, 0)" />
    </div>

    <div class="col-6 p-1">
      <img :src="getImageForIndex(images, 1)" class="img-fluid" @click="selectImageWithIndex(images, 1)" />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue'
import useTileComposable from '../../../../../composables/tiles'

export default {
  name: 'TwoImages',
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
    const { selectImageWithIndex, getImageForIndex } = useTileComposable(app)
    return {
      selectImageWithIndex,
      getImageForIndex
    }
  }
}
</script>

<template>
  <div id="images" class="row">
    <div class="col-6 p-1">
      <v-img :src="getImageForIndex(0)" @click="selectedImage = selectImageWithIndex(0)"></v-img>
    </div>

    <div class="col-6 p-1">
      <v-img :src="getImageForIndex(1)" @click="selectedImage = selectImageWithIndex(1)"></v-img>
    </div>

    <div class="col-12 p-1">
      <v-img :src="getImageForIndex(2)" @click="selectedImage = selectImageWithIndex(2)"></v-img>
    </div>
  </div>
</template>

<script>
import tilesMixin from '@/mixins/tiles'

export default {
  // Component for showing images of a product
  // that contains more than 3 images
  name: 'ThreeImages',
  mixins: [tilesMixin]
}
</script>

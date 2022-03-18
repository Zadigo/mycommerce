<template>
  <div id="images" class="row">
    <div class="col-6 p-1">
      <v-img :src="getImageForIndex(0)" @click="selectImageWithIndex(0)"></v-img>
    </div>

    <div class="col-6 p-1">
      <v-img :src="getImageForIndex(1)" @click="selectImageWithIndex(1)"></v-img>
    </div>

    <div class="col-8 p-1">
      <!-- <div v-if="hasVideo" class="video-action" @click="doPlay">
        <v-img :src="getImageForIndex(0)"></v-img>
        <v-icon :x-large="true" color="white">mdi-play</v-icon>
      </div> -->

      <div v-if="hasVideo" class="video-wrapper">
        <video :poster="getImageForIndex(1)" playsinline autoplay controls loop>
          <source :src="productVideo.content|mediaUrl" type="video/mp4" muted>
        </video>
        <!-- <b-embed ref="videoSource" :poster="getImageForIndex(0)" type="video" controls>
        </b-embed> -->
      </div>

      <v-img v-else :src="getImageForIndex(2)" @click="selectImageWithIndex(2)"></v-img>

    </div>


    <div class="col-4 p-1">
      <div v-if="hasVideo" class="col-12 pt-0 p-1">
        <v-img :src="getImageForIndex(2)" @click="selectImageWithIndex(2)"></v-img>
      </div>

      <div :class="{ 'pt-0': !hasVideo }" class="col-12 p-1">
        <v-img :src="getImageForIndex(3)" @click="selectImageWithIndex(3)"></v-img>
      </div>
    </div>
  </div>
</template>

<script>
import tilesMixin from './tilesMixin'

export default {
  // Component for showing images of a product
  // that contains more than 3 images
  name: 'MultipleImages',
  mixins: [tilesMixin]
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
  /* height: 100%; */
  object-fit: cover;
}
</style>

<template>
  <!-- TODO: Add ID on action elements on the page -->
  <div class="d-flex flex-direction-colum justify-content-around">

    <!-- Other images -->
    <div id="images" style="width:15%;margin-right: .5rem;">
      <b-img v-for="(image, i) in images" :key="image.id" :alt="image.name" :src="image.mid_size|mediaUrl" :class="{ darken: i != cursor }" class="mb-2" fluid @click="changeImage(i)" />      
      
      <b-img v-if="hasVideo" :src="images[0].mid_size|mediaUrl" fluid @click="playVideo = !playVideo" />

      <!-- TODO: Show video preview image for playing -->
      <!-- <b-btn v-if="hasVideo" variant="light" block @click="playVideo = !playVideo">
        <font-awesome-icon icon="play" />
      </b-btn>

      <b-btn variant="light" block>
        <font-awesome-icon icon="share" />
      </b-btn> -->
    </div>

    <div id="image">
      <!-- Video -->
      <b-embed v-if="playVideo & hasVideo" :poster="mainImage.original|mediaUrl" type="video" aspect="4by3" controls>
        <source :src="productVideo.content|mediaUrl" type="video/mp4">
      </b-embed>
      
      <!-- Image -->
      <b-img v-else :src="imageToDisplay.mid_size|mediaUrl" :alt="imageToDisplay.name" fluid />

      <base-tag v-if="isNew" :is-absolute="true" :top="3" :left="5" :padding="2" background-color="primary">
        <template>
          {{ $t('New') }}
        </template>
      </base-tag>
    </div>
  </div>
</template>

<script>
var _ = require('lodash')

export default {
  name: 'Images',
  
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
    cursor: 0,
    playVideo: false
  }),
  
  computed: {
    mainImage () {
      var mainImage = _.find(this.images, ['is_main_image', true])
      return _.isUndefined(mainImage) ? this.images[0] : mainImage
    },

    imageToDisplay () {
      return this.images[this.cursor]
    },
    
    hasVideo () {
      return !_.isNull(this.productVideo)
    }
  },
  
  methods: {
    changeImage (index) {
      if (this.playVideo) { this.playVideo = false }
      this.cursor = index
    }
  }
}
</script>

<style scoped>
  #image {
    position: relative;
  }

  #images img {
    cursor: pointer;
  }

  .embed-responsive video {
    width: 100%;
    height: auto;
  }

  .darken {
    opacity: 0.5;
  }
</style>

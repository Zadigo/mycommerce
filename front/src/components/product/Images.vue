<template>
  <!-- TODO: Add ID on action elements on the page -->
  <div class="d-flex flex-direction-colum justify-content-around">

    <!-- Other images -->
    <div id="images" style="width:15%;margin-right: .5rem;">
      <b-img v-for="(image, i) in images" :key="image.id" :alt="image.name" :src="image.mid_size|mediaUrl" :class="{ darken: i != cursor }" class="mb-2" fluid @click="changeImage(i)" />      
      
      <div v-if="hasVideo" class="video-action" @click="doPlay">
        <b-img :src="images[0].mid_size|mediaUrl" fluid />
        <v-icon :x-large="true" color="white" style="opacity:0.8;">mdi-play</v-icon>
      </div>

      <!-- TODO: Show video preview image for playing -->
      <b-btn class="mt-3 shadow-none outline-primary" variant="light" block>
        <font-awesome-icon icon="share" />
      </b-btn>
    </div>

    <div id="image">
      <!-- Video -->
      <div v-if="playVideo && hasVideo" class="video-wrapper">
        <b-embed ref="videoSource" :poster="mainImage.mid_size|mediaUrl" type="video" aspect="4by3" controls>
          <source :src="productVideo.content|mediaUrl" type="video/mp4" muted>
        </b-embed>
      </div>
      
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
      if (! this.productVideo) {
        return false
      } else {
        return Object.keys(this.productVideo).length > 0
      }
    }
  },
  
  methods: {
    changeImage (index) {
      if (this.playVideo) { this.playVideo = false }
      this.cursor = index
    },

    doPlay () {
      this.playVideo = !this.playVideo

      try {
        var items = this.$refs.videoSource.getElementsByTagName('video')
        items[0].play()
      } catch {
        this.$store.dispatch('addErrorMessage', 'Could not start video')
      }
    }
  }
}
</script>

<style scoped>
  #image {
    position: relative;
    width: 100%;
    height: 100%;
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
  }
</style>

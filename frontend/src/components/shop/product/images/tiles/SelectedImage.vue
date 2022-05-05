<template>
  <div class="col-12 selected-image">
    <div ref="link" :class="{ zoom: isZoomed }" class="img-container" @mousemove="zoomEvent($event)">
      <img :src="mediaUrl(selectedImage)" class="img-fluid" @click="zoomImage($event)">
    </div>

    <v-btn id="btn-close" icon>
      close
      <!-- <v-icon @click="$emit('reset-selected-image')">mdi-close</v-icon> -->
    </v-btn>

    <!-- <base-tag v-if="isNew" :is-absolute="true" :top="3" :left="5" :padding="2" background-color="primary">
      <template>
        {{ $t('New') }}
      </template>
    </base-tag> -->
  </div>
</template>

<script>
import { mediaUrl } from '@/utils'

export default {
  name: 'SelectedImage',
  props: {
    selectedImage: {
      type: String,
      required: true
    },
    isNew: {
      type: Boolean
    }
  },
  setup() {
    return {
      mediaUrl
    }
  },
  data: () => ({
    isZoomed: false
  }),
  methods: {
    zoomImage(e) {
      this.isZoomed = !this.isZoomed

      var image = this.$refs.link.querySelector('img')
      var mouseX = e.pageX
      var mouseY = e.pageY
      var totalX = this.$refs.link.clientWidth
      var totalY = this.$refs.link.clientHeight
      var centerX = totalX / mouseX
      var centerY = totalY / mouseY
      var shiftX = centerX - mouseX
      var shiftY = centerY - mouseY

      // image.style.right = `${shiftX}px`
      // image.style.top = `${shiftY}px`
      image.transform = `translate(${shiftX}px, ${shiftY}px)`
    },

    zoomEvent(e) {
      if (this.isZoomed) {
        var image = this.$refs.link.querySelector('img')
        var mouseX = e.pageX
        var mouseY = e.pageY
        var totalX = this.$refs.link.clientWidth
        var totalY = this.$refs.link.clientHeight
        var centerX = totalX / mouseX
        var centerY = totalY / mouseY
        var shiftX = centerX - mouseX
        var shiftY = centerY - mouseY
  
        // image.style.left = `${shiftX}px`
        // image.style.top = `${shiftY}px`
        image.transform = `translate(${shiftX}px, ${shiftY}px)`
      }
    }
  }
}
</script>

<style scoped>
.selected-image {
  position: relative;
}

#btn-close {
  position: absolute;
  top: 2%;
  right: 5%;
}

.img-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 800px;
}

.img-container.zoom img {
  position: absolute;
  top: 0%;
  left: 0%;
  transform: scale(2.5, 2.5);
}

</style>

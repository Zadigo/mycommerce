<template>
  <div class="col-12 selected-image">
    <div ref="link" :class="{ zoom: isZoomed }" class="img-container" @click="zoomImage($event)" @mousemove="imageEventListener">
      <img :src="mediaUrl(selectedImage)" class="img-fluid">
    </div>

    <button id="btn-close" type="button" class="btn-close" @click="$emit('reset-selected-image')"></button>
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
  emits: ['reset-selected-image'],
  setup () {
    return {
      mediaUrl
    }
  },
  data: () => ({
    isZoomed: false
  }),
  methods: {
    zoomImage () {
      this.isZoomed = !this.isZoomed
      if (this.isZoomed) {
        this.$refs.link.style.cursor = 'crosshair'
      } else {
        this.$refs.link.style.cursor = 'zoom-in'
        const image = this.$refs.link.querySelector('img')
        image.style.transform = 'translate(0px, 0px)'
      }
    },
    imageEventListener (e) {
      if (this.isZoomed) {
        const container = this.$refs.link

        const mousePositionX = e.clientX
        const mousePositionY = e.clientY
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight
        const centerX = containerWidth / mousePositionX * 100
        const centerY = containerHeight / mousePositionY * 100

        const image = this.$refs.link.querySelector('img')
        image.style.transform = 'scale(5, 5)'
        image.style.transform = `translate(${centerX}px, ${centerY}px)`
      }
    }
    // zoomImage (e) {
    //   this.isZoomed = !this.isZoomed

    //   const image = this.$refs.link.querySelector('img')
    //   const mouseX = e.pageX
    //   const mouseY = e.pageY
    //   const totalX = this.$refs.link.clientWidth
    //   const totalY = this.$refs.link.clientHeight
    //   const centerX = totalX / mouseX
    //   const centerY = totalY / mouseY
    //   const shiftX = centerX - mouseX
    //   const shiftY = centerY - mouseY

    //   // image.style.right = `${shiftX}px`
    //   // image.style.top = `${shiftY}px`
    //   image.transform = `translate(${shiftX}px, ${shiftY}px)`
    // },

    // zoomEvent (e) {
    //   if (this.isZoomed) {
    //     const image = this.$refs.link.querySelector('img')
    //     const mouseX = e.pageX
    //     const mouseY = e.pageY
    //     const totalX = this.$refs.link.clientWidth
    //     const totalY = this.$refs.link.clientHeight
    //     const centerX = totalX / mouseX
    //     const centerY = totalY / mouseY
    //     const shiftX = centerX - mouseX
    //     const shiftY = centerY - mouseY

    //     // image.style.left = `${shiftX}px`
    //     // image.style.top = `${shiftY}px`
    //     image.transform = `translate(${shiftX}px, ${shiftY}px)`
    //   }
    // }
  }
}
</script>

<style scoped>
.selected-image {
  position: relative;
  cursor: zoom-in;
}

.btn-close {
  position: absolute;
  top: 2%;
  right: 15%;
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
